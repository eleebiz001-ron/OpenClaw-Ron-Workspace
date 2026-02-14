const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function quoteTweet(tweetId, comment) {
  try {
    const tweet = await client.v2.tweet({
      text: comment,
      quote_tweet_id: tweetId
    });
    console.log(`SUCCESS: Quote Tweet posted! ID: ${tweet.data.id}`);
    return tweet.data.id;
  } catch (error) {
    console.error(`FAILED to quote tweet ${tweetId}:`, JSON.stringify(error, null, 2));
  }
}

const args = process.argv.slice(2);
const tweetId = args[0];
const comment = args[1];

if (!tweetId || !comment) {
  console.log('Usage: node x_quote_tweet.js "tweet_id" "comment"');
} else {
  quoteTweet(tweetId, comment);
}
