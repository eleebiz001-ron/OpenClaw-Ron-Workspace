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

async function replyToStellar() {
  try {
    const replyText = "Great to see @Top_nod powered by Stellar—expanding real-world digital ownership with precision.";

    const tweet = await client.v2.reply(replyText, "2022062336555819048");

    console.log('Successfully replied to StellarOrg:', tweet.data.id);
  } catch (error) {
    console.error('Error posting reply:', error);
    process.exit(1);
  }
}

replyToStellar();
