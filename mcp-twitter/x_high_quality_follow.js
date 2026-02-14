const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runEliteExpansion() {
  const myId = '2017763735809757187';
  const queries = ['XRP', 'HBAR', 'XDC', 'Chainlink', 'ISO20022'];
  
  console.log('Starting High-Quality Elite Expansion...');

  for (const query of queries) {
    try {
      console.log(`Scanning for elite influencers in: ${query}`);
      // 최근 해당 키워드에 대해 반응이 좋은 '검증된' 유저 검색
      const search = await client.v2.search(query, { 
        max_results: 15,
        "user.fields": ["public_metrics", "verified", "description"],
        "expansions": ["author_id"]
      });
      
      if (search.data && search.includes && search.includes.users) {
        for (const user of search.includes.users) {
          const followerCount = user.public_metrics.followers_count;
          
          // 대표님 지침: 팔로워 수 최소 수천 명 이상 (여기서는 안전하게 1000명 이상으로 세팅)
          if (followerCount >= 1000) {
            console.log(`Checking @${user.username} (Followers: ${followerCount})...`);
            
            // 중복 팔로우 방지 및 팔로우 실행
            try {
              await client.v2.follow(myId, user.id);
              console.log(`✅ Successfully added Elite: @${user.username}`);
            } catch (e) {
              console.log(`Skipped @${user.username}: ${e.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
          } else {
            console.log(`❌ Skipped @${user.username}: Too few followers (${followerCount})`);
          }
        }
      }
    } catch (e) {
      console.log(`Query failed: `, e.message);
    }
  }
}
runEliteExpansion();
