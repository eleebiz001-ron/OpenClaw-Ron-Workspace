const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function quoteTweetFixed() {
  try {
    const tweetText = "The synergy between TokenEscrow and MPTs is the ultimate catalyst for the XRPL-Flare ecosystem. 🧬⚡️\n\nWith MPTs providing multi-purpose token flexibility and TokenEscrow unlocking XRPL assets for @FlareNetworks DeFi, we are seeing the true architecture of future finance. This isn't just about interoperability; it's about giving XRPL tokens the smart contract power they need to dominate the tokenization wars. 🏛️🚀\n\nBrilliant insight from @HugoPhilion—the infrastructure for institutional-grade utility is now complete.\n\n#XRPL #FlareNetwork #MPT #TokenEscrow #DeFi #UtilityCoins #FintechInnovation";

    // quote_tweet_id 필드를 사용하여 v2 리포스트 실행
    const tweet = await client.v2.tweet({
      text: tweetText,
      quote_tweet_id: "2022225850020569504"
    });

    console.log('Successfully quote posted tweet:', tweet.data.id);
  } catch (error) {
    console.error('Error posting quote tweet:', error);
    process.exit(1);
  }
}

quoteTweetFixed();
