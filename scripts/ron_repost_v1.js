const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const XAI_API_KEY = process.env.XAI_API_KEY;

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function callGrok(payload) {
  const url = 'https://api.x.ai/v1/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`xAI API error: ${res.status} ${text}`);
  }
  return res.json();
}

async function run() {
  const users = ['FlareNetworks', 'CantonNetwork', 'HugoPhilion', 'YuvalRooz', 'MonicaLongSF', 'JoelKatz', 'ManceHarmon', 'leemonbaird', 'hedera', 'Ripple', 'bgarlinghouse', 'StellarOrg'];
  let allTweets = [];

  const historyPath = '/Users/ieunchul/clawd/x_history.json';
  let history = { replied: [], reposted: [] };
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath));
  }

  console.log('--- Fetching latest high-signal tweets ---');
  for (const username of users) {
    try {
      const user = await client.v2.userByUsername(username);
      const tweets = await client.v2.userTimeline(user.data.id, {
        max_results: 10,
        "tweet.fields": ["public_metrics", "text", "created_at"]
      });
      if (tweets.data && tweets.data.data) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 2); // Look back 2 days for reposts

        tweets.data.data.forEach(t => {
          const tweetDate = new Date(t.created_at);
          if (tweetDate >= yesterday) {
            allTweets.push({
              id: t.id,
              text: t.text,
              username: username,
              engagement: (t.public_metrics.retweet_count || 0) + (t.public_metrics.like_count || 0),
              metrics: t.public_metrics
            });
          }
        });
      }
    } catch (e) {
      console.error(`Error fetching ${username}:`, e.message);
    }
  }

  if (allTweets.length === 0) {
    console.log('No tweets found.');
    return;
  }

  // Filter out already reposted
  const candidates = allTweets.filter(t => !history.reposted?.includes(t.id));
  
  // Sort by engagement
  candidates.sort((a, b) => b.engagement - a.engagement);

  const top3 = candidates.slice(0, 3);
  console.log(`Selected ${top3.length} tweets for strategic reposting.`);

  for (const target of top3) {
    console.log(`Processing @${target.username} [${target.id}]`);
    
    const prompt = `
Analyze this high-signal tweet from @${target.username}: "${target.text}"

Generate a very brief "Quote Tweet" comment (10-15 words) that adds executive insight.
Theme: Global infrastructure, national-grade utility, or strategic importance of the tech/ecosystem (XRP, HBAR, etc.).
Tone: Professional, authoritative, and visionary.
`;

    const payload = {
      model: 'grok-3',
      messages: [
        { role: 'system', content: 'You are Ron, strategic advisor to a tech executive.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    };

    try {
      const grokRes = await callGrok(payload);
      const comment = grokRes.choices[0].message.content.trim().replace(/^"|"$/g, '');
      console.log(`Insight: ${comment}`);

      // Perform Quote Tweet
      const result = await client.v2.quote(comment, target.id);
      console.log(`SUCCESS: Reposted! ID: ${result.data.id}`);

      if (!history.reposted) history.reposted = [];
      history.reposted.push(target.id);
      
      // Update history in real-time
      fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

      // Log to memory
      const date = new Date().toISOString().split('T')[0];
      const logEntry = `\n- **Strategic Repost [${new Date().toLocaleTimeString()}]:** @${target.username} (ID: ${target.id}). Insight: "${comment}"\n`;
      fs.appendFileSync(`/Users/ieunchul/clawd/memory/x_reposts_${date}.md`, logEntry);

    } catch (err) {
      console.error(`Failed to process ${target.id}:`, err.message);
    }
  }
}

run();
