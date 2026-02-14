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

async function replyToHugo() {
  try {
    const replyText = "Definitely looking forward to this. Radical innovation in governance is key to sustainable ecosystem growth. Can’t wait to see how this proposal reshapes the future of Flare and XRPL synergy. @HugoPhilion 🧬⚡️";

    const tweet = await client.v2.reply(replyText, "2022282965871743112");

    console.log('Successfully replied to Hugo Philion:', tweet.data.id);
  } catch (error) {
    console.error('Error posting reply:', error);
    process.exit(1);
  }
}

replyToHugo();
