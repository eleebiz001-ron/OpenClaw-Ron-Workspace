const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runFullAudit() {
  const myId = '2017763735809757187';
  console.log('--- Ron\'s Full Security Audit & Cleanup Starting ---');
  
  try {
    let following = [];
    let nextToken = null;
    
    // 1. 모든 팔로잉 목록 가져오기
    do {
      const response = await client.v2.following(myId, { 
        "user.fields": ["public_metrics", "verified", "description"],
        pagination_token: nextToken 
      });
      following = following.concat(response.data);
      nextToken = response.meta.next_token;
    } while (nextToken);

    console.log(`Total Following to Audit: ${following.length}`);

    for (const user of following) {
      const followerCount = user.public_metrics.followers_count;
      const isVerified = user.verified;
      
      // 탈락 기준: 팔로워 1,000명 미만 (단, 사모님 및 수동으로 영입한 거물급은 예외 처리 필요하나 일단 수치로 엄격히 적용)
      // 예외 리스트: 사모님, 주요 거물들 (이들은 이미 팔로워가 많으므로 통과)
      if (followerCount < 1000 && user.username !== 'wsopym' && user.username !== 'SophiaYoon19') {
        console.log(`❌ EXPELLING @${user.username} (Followers: ${followerCount})`);
        await client.v2.unfollow(myId, user.id);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(`✅ PASS @${user.username} (Followers: ${followerCount})`);
      }
    }
    console.log('--- Audit Completed! ---');
  } catch (e) {
    console.log('Audit failed:', e.message);
  }
}
runFullAudit();
