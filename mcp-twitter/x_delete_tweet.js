const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function deleteTweet(tweetId) {
  try {
    await client.v2.deleteTweet(tweetId);
    console.log(`SUCCESS: Tweet ${tweetId} deleted.`);
  } catch (error) {
    console.error(`FAILED to delete tweet ${tweetId}:`, error);
  }
}

const args = process.argv.slice(2);
args.forEach(id => deleteTweet(id));
