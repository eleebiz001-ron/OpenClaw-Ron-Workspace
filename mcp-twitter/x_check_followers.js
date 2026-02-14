const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function checkFollowers() {
  try {
    const me = await client.v2.me({ "user.fields": ["public_metrics"] });
    console.log('--- Real-time X Server Data ---');
    console.log('Followers:', me.data.public_metrics.followers_count);
    console.log('Following:', me.data.public_metrics.following_count);
    console.log('Tweet Count:', me.data.public_metrics.tweet_count);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
checkFollowers();
