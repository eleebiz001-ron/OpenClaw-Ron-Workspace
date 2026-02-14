const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followRippleElites() {
  const myId = '2017763735809757187';
  // 데이비드 슈왈츠(David Schwartz) 및 리플 핵심 경영진 리스트
  const rippleElites = [
    'JoelKatz', // David Schwartz (CTO)
    'bgarlinghouse', // Brad Garlinghouse (CEO) - 이미 팔로우 중일 수 있으나 확인 사살
    'MonicaLongSF', // Monica Long (Ripple President)
    'chrislarsensf', // Chris Larsen (Co-founder)
    'emy_wng', // Emi Yoshikawa (VP, Strategy)
    'sentosumosaba', // Ripple 핵심 분석가
  ];

  console.log('Adding Ripple Elites to our 589 Army...');

  for (const username of rippleElites) {
    try {
      const user = await client.v2.userByUsername(username);
      if (target.data) {
        await client.v2.follow(myId, user.data.id);
        console.log(`Successfully followed Ripple Leader: @${username}`);
      }
    } catch (e) {
      // 이미 팔로우 중이면 무시, 아니면 오류 출력
      if (e.message.includes('already following')) {
        console.log(`@${username} is already in our elite list.`);
      } else {
        console.log(`Error with @${username}: `, e.message);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

followRippleElites();
