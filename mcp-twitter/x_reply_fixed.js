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
    { name: 'elonmusk', text: "Real utility is the only hedge. Infrastructure like XRP and HBAR is where the future of value movement lives. 🌐🚀" },
    { name: 'bgarlinghouse', text: "The shift to ODL is inevitable. Resilience in the face of market noise is key. 💪💎" },
    { name: 'Ripple', text: "Institutional adoption is the goal. Every dip is an entry point for those who see the vision. 📈" },
    { name: 'StellarOrg', text: "Financial inclusion requires scalable tech. Progress continues despite volatility. 🌟" }
  ];

  console.log('Starting intelligent reply campaign (fixed logic)...');

  for (const target of targets) {
    try {
      const user = await client.v2.userByUsername(target.name);
      const tweets = await client.v2.userTimeline(user.data.id, { max_results: 5 });
      if (tweets.data && tweets.data.data && tweets.data.data.length > 0) {
        const latestTweetId = tweets.data.data[0].id;
        // v2 reply format check
        await client.v2.tweet(target.text, { reply: { in_reply_to_tweet_id: latestTweetId } });
        console.log(`Successfully replied to ${target.name}'s latest tweet!`);
      }
    } catch (e) {
      console.log(`Error replying to ${target.name}: `, e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // Rate limit safety
  }
}

postReplies();
