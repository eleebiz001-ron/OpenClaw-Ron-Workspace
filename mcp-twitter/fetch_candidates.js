const { TwitterApi } = require('twitter-api-v2');
const path = require('path');
const fs = require('fs');

// Path to .env (adjust if needed to point to mcp-twitter/.env)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const CITL = [
  'VitalikButerin',
  'saylor',
  'CathieDWood',
  'balajis',
  'APompliano',
  'cz_binance',
  'brian_armstrong',
  'elonmusk',
  'bgarlinghouse',
  'MonicaLongSF',
  'DenelleDixon'
];

async function fetchLatest() {
  let candidates = [];
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  for (const username of CITL) {
    try {
      const user = await client.v2.userByUsername(username);
      if (!user.data) continue;

      const timeline = await client.v2.userTimeline(user.data.id, {
        max_results: 5,
        start_time: twentyFourHoursAgo,
        "tweet.fields": ["public_metrics", "text", "created_at", "entities"],
        exclude: ['retweets', 'replies']
      });

      if (timeline.data && timeline.data.data) {
        timeline.data.data.forEach(t => {
          candidates.push({
            id: t.id,
            text: t.text,
            username: username,
            engagement: t.public_metrics.like_count + t.public_metrics.retweet_count * 2,
            created_at: t.created_at
          });
        });
      }
    } catch (e) {
      // If 403, we need to signal it
      if (e.code === 403) {
        console.error('API_BLOCKED_403');
        process.exit(1);
      }
      console.error(`Error fetching ${username}:`, e.message);
    }
  }

  candidates.sort((a, b) => b.engagement - a.engagement);
  console.log(JSON.stringify(candidates.slice(0, 5), null, 2));
}

fetchLatest();
