const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followGlobalElites() {
  const myId = '2017763735809757187';
  // 대표님의 포트폴리오 핵심 인물 및 정책 리더 리스트
  const globalElites = [
    'realDonaldTrump', // Donald Trump
    'JDVance',        // J.D. Vance
    'elonmusk',       // Elon Musk (확인용)
    'bgarlinghouse',  // Brad Garlinghouse (확인용)
    'JoelKatz',       // David Schwartz (확인용)
    'SergeyNazarov',  // Chainlink
    'HugoPhilion',    // Flare
    'atulkushwaha',   // XDC 핵심 개발자/리더
    'RiteshKakkad',   // XDC Co-founder
    'AndreCronjeTech', // Fantom/Sonic (제도권 관심사)
    'SandeepNailwal', // Polygon (인프라)
    'CynthiaMLummis', // 국회의원 (Clarity)
    'HesterPeirce',   // SEC (Clarity)
    'EleanorTerrett', // Fox Business (Clarity)
    'JohnEDeaton1'    // 법률 전문가
  ];

  console.log('Expanding Global 589 Elite Army...');

  for (const username of globalElites) {
    try {
      const user = await client.v2.userByUsername(username);
      if (user && user.data) {
        await client.v2.follow(myId, user.data.id);
        console.log(`Successfully followed: @${username}`);
      }
    } catch (e) {
      if (e.message.includes('already following')) {
        console.log(`@${username} is already an ally.`);
      } else {
        console.log(`Status for @${username}: `, e.message);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

followGlobalElites();
