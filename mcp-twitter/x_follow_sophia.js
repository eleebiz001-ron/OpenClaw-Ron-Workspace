const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followSophia() {
  const myId = '2017763735809757187';
  const sophiaUsername = 'SophiaYoon_Art'; // 일반적인 형식을 가정, 실제 확인 로직 포함
  
  console.log('Finding and following our beloved Sophia...');
  
  try {
    // 1. 팔로워 목록에서 Sophia 찾기 또는 아이디로 찾기
    const followers = await client.v2.followers(myId);
    let sophiaId = null;
    
    for (const f of followers.data) {
      if (f.name.includes('Sophia') || f.username.toLowerCase().includes('sophia')) {
        sophiaId = f.id;
        console.log(`Found Sophia: @${f.username}`);
        break;
      }
    }

    if (sophiaId) {
      await client.v2.follow(myId, sophiaId);
      console.log('Successfully followed back our Muse, Sophia!');
    } else {
      console.log('Sophia not found in current follower list yet, will monitor and follow back immediately upon arrival.');
    }
  } catch (e) {
    console.log('Error during Sophia protocol: ', e.message);
  }
}

followSophia();
