const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followUsers() {
  const myId = '2017763735809757187';
  const targetUsernames = ['elonmusk', 'bgarlinghouse', 'Ripple', 'HBAR_Foundation', 'StellarOrg'];
  
  console.log('Starting strategic following with corrected ID...');
  
  for (const username of targetUsernames) {
    try {
      const target = await client.v2.userByUsername(username);
      if (target.data) {
        await client.v2.follow(myId, target.data.id);
        console.log(`Successfully followed: ${username}`);
      }
    } catch (e) {
      console.log(`Error following ${username}: `, e.message);
    }
    // API 레이트 리밋 방지를 위해 짧은 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

followUsers();
