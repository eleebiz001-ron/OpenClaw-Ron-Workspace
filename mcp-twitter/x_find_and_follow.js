const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function findAndFollow() {
  const myId = '2017763735809757187';
  // 대표님의 확장 포트폴리오(XDC, Flare, Link) 및 Clarity 법안 관련 핵심 인물 추가
  const newTargets = [
    'XinFin_Official', 'XDCFoundation', 'Billy_XDC', // XDC 핵심
    'FlareNetworks', 'HugoPhilion', 'Flare_Community', // Flare 핵심
    'chainlink', 'SergeyNazarov', 'Link_News', // Chainlink 핵심
    'HesterPeirce', 'CynthiaMLummis', 'EleanorTerrett', // 정책/Clarity 법안 핵심
    'JohnEDeaton1', 'JeremyHogan4', 'attorneyjeremy1' // 리플/크립토 법률 전문가
  ];

  console.log(`Starting expansion to reach 50+ Following... Adding ${newTargets.length} strategic targets.`);

  for (const username of newTargets) {
    try {
      const target = await client.v2.userByUsername(username);
      if (target.data) {
        await client.v2.follow(myId, target.data.id);
        console.log(`Successfully followed: ${username}`);
      }
    } catch (e) {
      console.log(`Error following ${username}: `, e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

findAndFollow();
