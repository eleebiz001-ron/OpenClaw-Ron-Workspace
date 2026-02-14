const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;
const XAI_API_KEY = process.env.XAI_API_KEY;

if (!XAI_API_KEY) {
  console.error('Missing XAI_API_KEY in env.');
  process.exit(1);
}
if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
  console.error('Missing X API credentials in env (X_API_KEY/X_API_SECRET/X_ACCESS_TOKEN/X_ACCESS_SECRET).');
  process.exit(1);
}

const focus = [
  'elonmusk',
  'bgarlinghouse',
  'saylor',
  'SergeyNazarov',
  'FlareNetworks',
  'XDCFoundation',
];

const sourceFiles = [
  '/Users/ieunchul/clawd/mcp-twitter/x_bulk_follow.js',
  '/Users/ieunchul/clawd/mcp-twitter/x_find_and_follow.js',
  '/Users/ieunchul/clawd/mcp-twitter/x_follow_fixed.js',
];

function extractHandles(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const matches = text.match(/'([A-Za-z0-9_]+)'/g) || [];
  return matches.map(m => m.slice(1, -1));
}

function uniquePreserveOrder(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

const rawHandles = sourceFiles.flatMap(extractHandles);
const filtered = rawHandles.filter(h => h !== 'dotenv' && h !== '2017763735809757187');
const uniq = uniquePreserveOrder(filtered);

// Ensure focus accounts are first and included.
const ordered = uniquePreserveOrder([...focus, ...uniq.filter(h => !focus.includes(h))]);
const eliteHandles = ordered.slice(0, 51);

const client = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mapUsers(handles) {
  const res = await client.v2.usersByUsernames(handles, {
    'user.fields': ['id', 'username', 'name'],
  });
  const users = res.data || [];
  const map = new Map();
  for (const u of users) map.set(u.username.toLowerCase(), u);
  return map;
}

async function fetchLatestTweetsForUser(userId, username) {
  // Fetch up to 5 most recent tweets for each user.
  const res = await client.v2.userTimeline(userId, {
    max_results: 5,
    'tweet.fields': ['created_at', 'public_metrics'],
  });
  const tweets = res.data || [];
  return tweets.map(t => ({
    username,
    id: t.id,
    text: t.text,
    created_at: t.created_at,
    metrics: t.public_metrics || {},
  }));
}

async function gatherTweets() {
  const userMap = await mapUsers(eliteHandles);
  const now = Date.now();
  const cutoff = now - 2 * 60 * 60 * 1000;

  const allTweets = [];
  const users = eliteHandles
    .map(h => userMap.get(h.toLowerCase()))
    .filter(Boolean);

  const concurrency = 5;
  let idx = 0;

  async function worker() {
    while (idx < users.length) {
      const current = users[idx++];
      try {
        const tweets = await fetchLatestTweetsForUser(current.id, current.username);
        for (const t of tweets) {
          const ts = Date.parse(t.created_at);
          if (!Number.isNaN(ts) && ts >= cutoff) {
            allTweets.push({
              ...t,
              age_minutes: Math.round((now - ts) / 60000),
            });
          }
        }
      } catch (e) {
        // Skip on error to avoid halting the whole scan.
      }
      await sleep(200);
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  return allTweets;
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

async function generateDraft(tweets) {
  const focusLower = focus.map(h => h.toLowerCase());
  const prompt = [
    'You are Grok. Analyze the provided tweets from the last 2 hours among our elite list.',
    'Pick the single most viral or strategic tweet. Prefer @elonmusk, @bgarlinghouse, @saylor, @SergeyNazarov, @FlareNetworks, @XDCFoundation if comparable.',
    'Then write a Quote Retweet draft from @EunLee_Global perspective with Utility, Clarity, and 2026 Vision themes.',
    'If no strong/viral tweet exists, produce a deep-dive New Post on XRP or LINK based on current sentiment in the provided data.',
    'Output EXACTLY in this format:\nAction: [Repost/Quote/New Post]\nTarget: [@username or Topic]\nDraft: [English Text]\nReason: [Korean explanation of why this is the best play right now]'
  ].join('\n');

  const data = {
    now_iso: new Date().toISOString(),
    focus_accounts: focus,
    tweets,
  };

  const payload = {
    model: 'grok-4-fast-non-reasoning',
    messages: [
      { role: 'system', content: 'You are a sharp X strategist. Be concise and high-signal.' },
      { role: 'user', content: `${prompt}\n\nDATA:\n${JSON.stringify(data, null, 2)}` },
    ],
    temperature: 0.3,
  };

  try {
    const result = await callGrok(payload);
    const content = result?.choices?.[0]?.message?.content?.trim();
    if (content) return content;
  } catch (e) {
    // Fallback model if needed.
  }

  const fallbackPayload = {
    model: 'grok-3-mini',
    messages: payload.messages,
    temperature: 0.3,
  };
  const fallback = await callGrok(fallbackPayload);
  return fallback?.choices?.[0]?.message?.content?.trim() || '';
}

async function main() {
  const tweets = await gatherTweets();
  const output = await generateDraft(tweets);
  if (!output) {
    console.error('No output from Grok.');
    process.exit(1);
  }
  console.log(output);
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
