const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postNewTweet() {
  const text = process.argv.slice(2).join(' ');
  if (!text) {
    console.error('Error: No text provided.');
    return;
  }

  try {
    const tweet = await client.v2.tweet(text);
    console.log(`Successfully posted tweet! ID: ${tweet.data.id}`);
  } catch (e) {
    console.error('Error posting tweet: ', e.message);
  }
}

postNewTweet();
