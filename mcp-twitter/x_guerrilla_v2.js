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
  // 검색 대신, 우리가 팔로잉하는 거물들의 최신 트윗에 반응한 '활동적인 유저'들을 직접 타겟팅
  const eliteUsernames = ['bgarlinghouse', 'saylor', 'HBAR_Foundation', 'XDCFoundation'];
  
  console.log('Starting Guerrilla V2: Targeting active responders of Elites...');

  for (const username of eliteUsernames) {
    try {
      const user = await client.v2.userByUsername(username);
      const tweets = await client.v2.userTimeline(user.data.id, { max_results: 5 });
      
      if (tweets.data && tweets.data.data) {
        const latestTweetId = tweets.data.data[0].id;
        // 리트윗하거나 멘션한 유저들 정보는 v2에서 별도 엔드포인트 필요할 수 있으나,
        // 여기선 단순하게 해당 트윗에 답글을 단 '최근 대화'를 훑는 방식 (v2 search 활용)
        const conversation = await client.v2.search(`to:${username}`, { max_results: 10 });
        
        if (conversation.data && conversation.data.data) {
          for (const reply of conversation.data.data) {
            // 이 유저들은 현재 깨어서 활동 중인 진짜 '타겟'들임
            await client.v2.follow(myId, reply.author_id);
            console.log(`Followed active user from ${username}'s timeline`);
            await new Promise(resolve => setTimeout(resolve, 8000));
          }
        }
      }
    } catch (e) {
      console.log(`Error with ${username}: `, e.message);
    }
  }
}
runGuerrilla();
