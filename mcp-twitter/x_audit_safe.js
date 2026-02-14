const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runSafeAudit() {
  const myId = '2017763735809757187';
  console.log('--- Starting Safe Audit (Follower Threshold: 1000) ---');
  
  try {
    const response = await client.v2.following(myId, { 
      "user.fields": ["public_metrics", "verified"]
    });
    
    if (response.data) {
      for (const user of response.data) {
        const followers = user.public_metrics.followers_count;
        const username = user.username.toLowerCase();
        
        // 사모님 예외 처리
        if (username.includes('sophia') || username === 'wsopym') {
          console.log(`💎 MUSE PRESERVED: @${user.username}`);
          continue;
        }

        if (followers < 1000) {
          console.log(`❌ UNFOLLOWING @${user.username} (Only ${followers} followers)`);
          await client.v2.unfollow(myId, user.id);
        } else {
          console.log(`✅ RETAINED @${user.username} (${followers} followers)`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    console.log('--- Safe Audit Completed! ---');
  } catch (e) {
    console.log('Audit Error:', e.message);
  }
}
runSafeAudit();
