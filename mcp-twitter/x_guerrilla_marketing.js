const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runGuerrilla() {
  const myId = '2017763735809757187';
  // 유럽/아시아에서 현재 활동 중인 리전 타겟 키워드
  const queries = ['#XRPCommunity', '#HBAR', '#XDC', '#Chainlink', 'Clarity Act'];
  
  console.log('Starting Guerrilla Marketing for Europe/Asia timezones...');

  for (const query of queries) {
    try {
      // 1. 키워드로 최근 인기 트윗 검색
      const search = await client.v2.search(query, { max_results: 10, sort_order: 'relevancy' });
      
      for (const tweet of search.data.data) {
        // 2. 해당 트윗 작성자 팔로우 (맞팔 유도)
        await client.v2.follow(myId, tweet.author_id);
        // 3. 좋아요 (관심 표시)
        await client.v2.like(myId, tweet.id);
        console.log(`Engaged with user from query: ${query}`);
        
        // 레이트 리밋 방지 (강력한 딜레이)
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (e) {
      console.log(`Query ${query} failed: `, e.message);
    }
  }
}
runGuerrilla();
