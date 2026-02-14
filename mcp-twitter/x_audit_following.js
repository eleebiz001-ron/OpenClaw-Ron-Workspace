const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function auditFollowing() {
  try {
    const me = await client.v2.me();
    const following = await client.v2.following(me.data.id, { 
      "user.fields": ["verified", "public_metrics", "description"] 
    });
    
    console.log('--- Ron\'s Security Audit: Following List ---');
    for (const user of following.data) {
      const isVerified = user.verified ? '✅ Verified' : '❌ Unverified';
      console.log(`@${user.username} | ${user.name} | ${isVerified} | Followers: ${user.public_metrics.followers_count}`);
    }
  } catch (e) {
    console.log('Audit Error:', e.message);
  }
}
auditFollowing();
