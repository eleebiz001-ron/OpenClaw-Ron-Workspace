const fs = require('fs');
const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const content = process.argv[2];
const replyToId = process.argv[3];

if (!content) {
  console.error('Usage: node reply_to_x.js "Your reply" [reply_to_id]');
  process.exit(1);
}

async function run() {
  try {
    const options = {};
    if (replyToId) {
      options.reply = { in_reply_to_tweet_id: replyToId };
    }
    const tweet = await twitter.v2.tweet(content, options);
    console.log(`SUCCESS: ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
}

run();
