const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postReplies() {
  const targets = [
    { name: 'elonmusk', text: "Engineering the future requires resilience. XRP and HBAR provide the scalable utility that 2026 demands. 🚀" },
    { name: 'bgarlinghouse', text: "Legal clarity meets utility. The cross-border revolution is just getting started. Stay focused! 💎" },
    { name: 'Ripple', text: "ODL is the backbone of the new financial system. Watching the adoption curve closely. 📈" },
    { name: 'StellarOrg', text: "Financial inclusion via tech is the goal. Every step forward matters in this volatility. 🌟" }
  ];

  console.log('Starting ultra-resilient reply campaign...');

  for (const target of targets) {
    try {
      const user = await client.v2.userByUsername(target.name);
      // 타겟 사용자의 실제 ID 확인 후 멘션 형식으로 직접 트윗 (답글 대신 직접 멘션 전략 사용 가능성 타진)
      // 여기서는 다시 한 번 답글 규격 정밀 시도
      const tweets = await client.v2.userTimeline(user.data.id, { max_results: 5 });
      if (tweets.data && tweets.data.data && tweets.data.data.length > 0) {
        const latestTweetId = tweets.data.data[0].id;
        await client.v2.tweet(target.text, { reply: { in_reply_to_tweet_id: latestTweetId } });
        console.log(`Successfully replied to ${target.name}`);
      }
    } catch (e) {
      console.log(`Error with ${target.name}: `, e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 대기로 안전성 확보
  }
}

postReplies();
