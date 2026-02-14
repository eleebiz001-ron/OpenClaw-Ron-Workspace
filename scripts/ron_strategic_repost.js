const fs = require('fs');
const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

// Credentials
const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;
const XAI_API_KEY = process.env.XAI_API_KEY;

if (!XAI_API_KEY) {
  console.error('Missing XAI_API_KEY.');
  process.exit(1);
}

const twitter = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
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
  console.log('--- Ron Strategic Reposting: Starting ---');
  const blacklist = loadBlacklist();

  try {
    // 1. Search for high-signal tweets using Twitter Search (v2)
    // Filter by date to only include tweets from today or yesterday
    const now = new Date();
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    
    const query = '(XRP OR HBAR OR XLM OR "Utility Coins") lang:en -is:retweet';
    console.log(`Searching for: ${query} since ${startTime}`);
    
    const searchResult = await twitter.v2.search(query, {
      'tweet.fields': ['public_metrics', 'author_id', 'text', 'created_at', 'reply_settings'],
      'user.fields': ['username'],
      expansions: ['author_id'],
      'start_time': startTime,
      max_results: 10,
    });

    const tweets = searchResult.data.data || [];
    const users = searchResult.includes && searchResult.includes.users ? searchResult.includes.users : [];
    const authorMap = new Map(users.map(u => [u.id, u.username]));

    const eligibleTweets = tweets
      .map(t => ({
        ...t,
        username: authorMap.get(t.author_id) || ''
      }))
      .filter(t => t.reply_settings === 'everyone')
      .filter(t => !isBlacklistedTweet({ username: t.username, text: t.text }, blacklist));

    if (eligibleTweets.length === 0) {
      console.log('No high-signal tweets found in this window.');
      return;
    }

    // 2. Use Grok to filter and select the top 2-3
    const prompt = `
I have a list of recent high-engagement tweets about utility crypto assets.
Help me select the top 2-3 tweets that best align with the vision of "Utility, Clarity, XRP, HBAR, XLM" and a strategic "Made in USA" financial rail perspective.

Representative's Vision: Focus on assets with actual utility (not just speculation), regulatory clarity (Clarity Act), and infrastructure-grade value.

TWEETS:
${eligibleTweets.map((t, i) => `[${i}] (ID: ${t.id}, Likes: ${t.public_metrics.like_count}) ${t.text}`).join('\n\n')}

Select 2-3 Tweet IDs. For each selected tweet, provide a brief (under 280 chars) insightful comment to add when reposting.
The comment should sound visionary, executive, and precise.

Return JSON format:
{
  "selected": [
    { "id": "tweet_id", "comment": "your insight comment" },
    ...
  ]
}
`;

    const grokResponse = await callGrok({
      model: 'grok-3', // or grok-3 if available
      messages: [
        { role: 'system', content: 'You are a elite strategic advisor for a high-profile crypto executive.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: "json_object" }
    });

    const selection = JSON.parse(grokResponse.choices[0].message.content);
    console.log('Grok Selection:', JSON.stringify(selection, null, 2));

    for (const item of selection.selected) {
      console.log(`\nStrategically reposting Tweet ID: ${item.id}`);
      
      // Repost (Retweet) with Quote (Comment)
      await twitter.v2.tweet({
        text: item.comment,
        quote_tweet_id: item.id
      });
      
      console.log(`SUCCESS: Reposted ${item.id} with insight.`);
    }

    // Log to memory
    const date = new Date().toISOString().split('T')[0];
    const logPath = `/Users/ieunchul/clawd/memory/x_repost_log_${date}.md`;
    const logEntry = `\n## 🔄 Strategic Reposting Run: ${new Date().toLocaleString()}\n- **Selection:** ${JSON.stringify(selection)}\n`;
    fs.appendFileSync(logPath, logEntry);

  } catch (error) {
    console.error('CRITICAL ERROR:', error);
    process.exit(1);
  }
}

run();
