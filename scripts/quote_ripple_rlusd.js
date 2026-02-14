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

async function quoteRippleRLUSD() {
  try {
    const tweetText = "$RLUSD on @Binance with full XRPL support is a massive leap for institutional liquidity. This isn't just another stablecoin launch; it’s the standard for compliant, high-utility financial infrastructure going global. 🌐🏛️\n\nScalability meets credibility. Great to see the XRPL ecosystem expanding its reach.\n\n#XRP #XRPL #RLUSD #Binance #Stablecoin #CryptoInfrastructure #Utility";

    const tweet = await client.v2.tweet({
      text: tweetText,
      quote_tweet_id: "2021968216969322733"
    });

    console.log('Successfully quote posted Ripple tweet:', tweet.data.id);
  } catch (error) {
    console.error('Error posting quote tweet:', error);
    process.exit(1);
  }
}

quoteRippleRLUSD();
