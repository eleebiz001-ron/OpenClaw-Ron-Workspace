const { TwitterApi } = require('twitter-api-v2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postReply(tweetId, text) {
  try {
    console.log(`Replying to ${tweetId}...`);
    const tweet = await client.v2.reply(text, tweetId);
    console.log(`SUCCESS: Reply posted! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED to post reply:', error);
  }
}

const tweetId = process.argv[2];
const text = process.argv[3];

if (!tweetId || !text) {
  console.log('Usage: node x_post_reply_api.js tweetId "reply text"');
} else {
  postReply(tweetId, text);
}
