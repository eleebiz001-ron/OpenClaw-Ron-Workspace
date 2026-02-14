const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function run() {
  const text = "In a quiet market, XRP's utility shines through cross-border rails & smart contract integrations. Clarity on regulations will unlock trillions in 2026—envisioning seamless global finance where XRP powers instant settlements. Who's building the future? #XRP #Crypto2026";

  try {
    console.log('Posting tweet...');
    const tweet = await client.v2.tweet(text);
    console.log(`SUCCESS: Tweet posted! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

run();
