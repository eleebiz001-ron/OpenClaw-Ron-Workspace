const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config({ path: 'mcp-twitter/.env' });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function replyToTweet(tweetId, text, description) {
  try {
    console.log(`\nProcessing: ${description}`);
    console.log(`Target ID: ${tweetId}`);
    
    const reply = await client.v2.reply(text, tweetId);
    console.log(`✅ SUCCESS! Reply sent. ID: ${reply.data.id}`);
    return true;
  } catch (error) {
    console.error(`❌ FAILED to reply:`, error.message);
    if (error.data) console.error('Error details:', JSON.stringify(error.data, null, 2));
    return false;
  }
}

async function runBatch() {
  // 1. Tesla Optimus
  await replyToTweet(
    '2022719412281692324',
    "Compelling projection. The factory-first → home-next adoption path makes sense, and Tesla’s first‑principles iteration speed is a real advantage. The key inflection will be cost-down + reliability at scale—2028/29 seems plausible. Can’t wait to have one at home.",
    "Tesla Optimus"
  );

  // 2. Chainlink
  // Adding a small delay to be safe
  await new Promise(r => setTimeout(r, 2000));
  await replyToTweet(
    '2022778468094935198',
    "Clear and concise. The ‘universal translator’ framing is spot on—data, cross-chain, and legacy systems all need a trusted bridge. The institutional adoption angle will be the real catalyst. LINK everything 🔗",
    "Chainlink"
  );
}

runBatch();
