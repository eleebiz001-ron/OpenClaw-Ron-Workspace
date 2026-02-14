const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postReplies() {
  // Grok이 분석한 타겟 및 메시지 (론의 지능형 답글 전략)
  const targets = [
    { name: 'elonmusk', text: "Real utility is the only hedge against inflation. Infrastructure like XRP and HBAR is where the future of value movement lives. 🌐🚀" },
    { name: 'bgarlinghouse', text: "The shift to ODL is inevitable. Resilience in the face of market noise is what separates builders from gamblers. Stay strong! 💪💎" },
    { name: 'Ripple', text: "Institutional adoption is the goal. Every dip is just another entry point for those who understand the 2026 vision. 📈" },
    { name: 'StellarOrg', text: "Financial inclusion requires scalable tech. Great to see the progress being made despite the market's volatility. 🌟" }
  ];

  console.log('Starting intelligent reply campaign...');

  for (const target of targets) {
    try {
      // 1. 타겟의 최신 트윗 ID 가져오기
      const user = await client.v2.userByUsername(target.name);
      const tweets = await client.v2.userTimeline(user.data.id, { max_results: 5 });
      const latestTweetId = tweets.data.data[0].id;

      // 2. 답글 달기
      await client.v2.reply(target.text, latestTweetId);
      console.log(`Successfully replied to ${target.name}'s latest tweet!`);
    } catch (e) {
      console.log(`Error replying to ${target.name}: `, e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

postReplies();
