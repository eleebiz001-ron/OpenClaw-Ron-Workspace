const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const CITL = [
  'VitalikButerin', 'saylor', 'CathieDWood', 'balajis', 'APompliano',
  'cz_binance', 'brian_armstrong', 'elonmusk', 'bgarlinghouse',
  'MonicaLongSF', 'DenelleDixon'
];

async function fetchLatest() {
  for (const username of CITL) {
    try {
      console.log(`--- Fetching ${username} ---`);
      const user = await client.v2.userByUsername(username);
      if (!user.data) continue;
      
      const tweets = await client.v2.userTimeline(user.data.id, {
        max_results: 5,
        "tweet.fields": ["created_at", "public_metrics", "text"]
      });
      
      for (const tweet of tweets) {
        console.log(`[${username}] ${tweet.created_at}: ${tweet.text.replace(/\n/g, ' ')}`);
      }
    } catch (err) {
      console.error(`Error fetching ${username}:`, err.message);
    }
  }
}

fetchLatest();
