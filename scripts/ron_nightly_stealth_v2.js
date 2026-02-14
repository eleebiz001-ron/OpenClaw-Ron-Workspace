const fs = require('fs');
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

function loadBlacklist() {
  const blacklistPath = '/Users/ieunchul/clawd/scripts/x_blacklist.json';
  try {
    const raw = fs.readFileSync(blacklistPath, 'utf8');
    const arr = JSON.parse(raw);
    return new Set((Array.isArray(arr) ? arr : []).map(v => String(v).toLowerCase()));
  } catch (err) {
    console.error('Failed to load blacklist, proceeding with empty list:', err.message);
    return new Set();
  }
}

function extractMentions(text) {
  const matches = text.match(/@([A-Za-z0-9_]+)/g) || [];
  return matches.map(m => m.slice(1).toLowerCase());
}

function isBlacklistedTweet({ username, text }, blacklist) {
  const author = String(username || '').toLowerCase();
  if (blacklist.has(author)) return true;
  const mentions = extractMentions(text || '');
  return mentions.some(m => blacklist.has(m));
}

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
  const blacklist = loadBlacklist();
  const args = process.argv.slice(2);
  const isRepostAction = args.includes('--action') && args[args.indexOf('--action') + 1] === 'repost';
  const countLimit = args.includes('--count') ? parseInt(args[args.indexOf('--count') + 1]) : 1;

  const users = ['FlareNetworks', 'CantonNetwork', 'HugoPhilion', 'YuvalRooz', 'MonicaLongSF', 'JoelKatz', 'ManceHarmon', 'leemonbaird', 'hedera', 'Ripple', 'bgarlinghouse', 'StellarOrg', 'elonmusk']
    .filter(u => !blacklist.has(String(u).toLowerCase()));
  let allTweets = [];

  const historyPath = '/Users/ieunchul/clawd/x_history.json';
  let history = { replied: [], reposted: [], failed_targets: [] };
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath));
    if (!history.reposted) history.reposted = [];
    if (!history.failed_targets) history.failed_targets = [];
  }

  console.log('--- Fetching latest high-signal tweets ---');
  for (const username of users) {
    try {
      const user = await client.v2.userByUsername(username);
      const tweets = await client.v2.userTimeline(user.data.id, {
        max_results: 20,
        "tweet.fields": ["public_metrics", "text", "created_at", "reply_settings"]
      });
      if (tweets.data && tweets.data.data) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 2); // Increased window for variety

        tweets.data.data.forEach(t => {
          const tweetDate = new Date(t.created_at);
          if (tweetDate >= yesterday && t.reply_settings === 'everyone' && !isBlacklistedTweet({ username, text: t.text }, blacklist)) {
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

  allTweets.sort((a, b) => b.engagement - a.engagement);

  if (isRepostAction) {
    console.log(`--- Executing Repost Action (Limit: ${countLimit}) ---`);
    const candidates = allTweets.filter(t => !history.reposted.includes(t.id));
    const toRepost = candidates.slice(0, countLimit);

    for (const target of toRepost) {
      console.log(`Reposting @${target.username}: ${target.id}`);
      try {
        const user = await client.v2.me();
        await client.v2.retweet(user.data.id, target.id);
        console.log(`SUCCESS: Reposted ${target.id}`);
        history.reposted.push(target.id);
        
        // Brief insight via Grok
        const prompt = `Analyze this tweet: "${target.text}" by @${target.username}. Provide a 1-sentence strategic insight why this is important for global financial infrastructure. No hashtags. 15 words max.`;
        const grokRes = await callGrok({
          model: 'grok-3',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5
        });
        const insight = grokRes.choices[0].message.content.trim().replace(/^"|"$/g, '');
        console.log(`Insight: ${insight}`);
        
        // Optionally reply to our own retweet or just log it. For now, we log it.
        fs.appendFileSync(historyPath, ''); // Ensure file handle is clean
      } catch (err) {
        console.error(`Failed to repost ${target.id}:`, err.message);
      }
    }
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    return;
  }

  // --- Default Reply Logic ---
  console.log('--- Executing Stealth Reply Action ---');
  const candidates = allTweets.filter(t => !history.replied.includes(t.id) && !history.failed_targets.includes(t.id));
  if (candidates.length === 0) {
    console.log('No new targets.');
    return;
  }

  const target = candidates[0];
  console.log(`Target: @${target.username} - ID: ${target.id}`);

  const prompt = `Analyze this tweet: "${target.text}" by @${target.username}. Generate a concise (20 words max), strategic reply as a tech executive and Olympic Gold Medalist. Focus on utility, precision, and national infrastructure. Only mention coins (XRP, HBAR, etc.) if highly relevant.`;

  try {
    const grokRes = await callGrok({
      model: 'grok-3',
      messages: [
        { role: 'system', content: 'You are Ron, a strategic executive assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
    });
    const replyText = grokRes.choices[0].message.content.trim().replace(/^"|"$/g, '');
    console.log(`Generated Reply: ${replyText}`);

    const tweet = await client.v2.reply(replyText, target.id);
    console.log(`SUCCESS: Reply ID: ${tweet.data.id}`);
    history.replied.push(target.id);
  } catch (error) {
    console.error('FAILED:', error);
    if (error.code === 403 && error.data && error.data.detail && error.data.detail.includes('restricted who can reply')) {
      console.log(`Blacklisting restricted target: ${target.id}`);
      history.failed_targets.push(target.id);
    }
  }
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

run();
