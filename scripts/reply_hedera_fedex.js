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

async function replyToHedera() {
  try {
    const replyText = "Welcome @FedEx to the @hedera Council! Combining FedEx's operational expertise with Hedera’s trusted digital infrastructure is a game-changer for reducing friction in global trade. The utility of Hedera continues to expand. 🏛️🚀 #Logistics #Blockchain #HBAR";

    const tweet = await client.v2.reply(replyText, "2022310938603356595");

    console.log('Successfully replied to Hedera/FedEx:', tweet.data.id);
  } catch (error) {
    console.error('Error posting reply:', error);
    process.exit(1);
  }
}

replyToHedera();
