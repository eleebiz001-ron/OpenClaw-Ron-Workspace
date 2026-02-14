const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function getLatest(username) {
  try {
    const user = await client.v2.userByUsername(username);
    const tweets = await client.v2.userTimeline(user.data.id, { 
      max_results: 5,
      "tweet.fields": ["created_at", "text"]
    });
    for (const tweet of tweets) {
        console.log(`--- TWEET ID: ${tweet.id} ---`);
        console.log(tweet.text);
        console.log('-------------------------');
    }
  } catch (error) {
    console.error('FAILED to fetch tweets:', error);
  }
}

const target = process.argv[2] || 'elonmusk';
getLatest(target);
