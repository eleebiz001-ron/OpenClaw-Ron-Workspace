const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postTweet(text) {
  try {
    console.log('Sending tweet via API...');
    const tweet = await client.v2.tweet(text);
    console.log(`SUCCESS: Tweet posted! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED to post tweet:', JSON.stringify(error, null, 2));
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
  postTweet(args.join(' '));
} else {
  console.log('Usage: node ron_twitter_engine.js "Your tweet text"');
}
