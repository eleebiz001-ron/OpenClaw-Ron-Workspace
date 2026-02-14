const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function listFollowing() {
  const myId = '2017763735809757187';
  try {
    const following = await client.v2.following(myId, { 
      "user.fields": ["public_metrics", "description"] 
    });
    if (following.data) {
      console.log(`Currently following ${following.data.length} accounts:`);
      following.data.forEach(u => console.log(`- @${u.username} (${u.public_metrics.followers_count} followers): ${u.description?.substring(0, 50)}`));
    } else {
      console.log('Not following anyone or error fetching list.');
    }
  } catch (e) {
    console.error('List failed:', e.message);
  }
}
listFollowing();
