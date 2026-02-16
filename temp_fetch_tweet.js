const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config({ path: 'mcp-twitter/.env' });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function fetchTweet(id) {
  try {
    const tweet = await client.v2.singleTweet(id, {
      'tweet.fields': ['text', 'author_id', 'created_at']
    });
    console.log(JSON.stringify(tweet.data, null, 2));
  } catch (error) {
    console.error('Error fetching tweet:', error);
  }
}

fetchTweet('2022719412281692324');
