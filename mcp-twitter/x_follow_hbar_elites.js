const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followHbarElites() {
  const myId = '2017763735809757187';
  // 헤데라(Hedera) 및 HBAR 재단 핵심 리더 리스트
  const hbarElites = [
    'HBAR_Foundation', // HBAR Foundation Official
    'hedera',          // Hedera Official
    'chasker',         // Christian Hasker (CMO of Swirlds Labs / Hedera)
    'ShayneHigdon',    // Shayne Higdon (CEO of HBAR Foundation)
    'LeemonBaird',     // Dr. Leemon Baird (Co-founder & Inventor of Hashgraph)
    'ManceHarmon'      // Mance Harmon (Co-founder)
  ];

  console.log('Adding Hedera (HBAR) Elites to our 589 Army...');

  for (const username of hbarElites) {
    try {
      const user = await client.v2.userByUsername(username);
      if (user && user.data) {
        await client.v2.follow(myId, user.data.id);
        console.log(`Successfully followed Hedera Leader: @${username}`);
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

followHbarElites();
