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

async function postUTXOAnalysis() {
  try {
    // UTXO Age Bands 차트 이미지 업로드
    const mediaId = await client.v1.uploadMedia('/Users/ieunchul/.openclaw/media/inbound/file_80---793f0a0d-947b-4242-8557-96b6f3a8b869.jpg');

    const tweet = await client.v2.tweet({
      text: "Is the 4-year cycle broken? The data says YES. 📊\nAnalyzing the Realized Cap UTXO Age Bands reveals that Bitcoin holders are behaving unlike any previous cycle. We are no longer bound by the 2012-2024 rhythmic patterns.\n\nWhile many fear a long-term bear market, the resilience of the 6-month+ age bands indicates that the next rally could start much sooner than the consensus expects. The \"New Normal\" for Bitcoin is here, and it's faster than ever. 🚀\n\n#BTC #CryptoAnalysis #OnChain #MarketPivot #DigitalGold #BitcoinNews",
      media: { media_ids: [mediaId] }
    });

    console.log('Successfully posted UTXO analysis tweet:', tweet.data.id);
  } catch (error) {
    console.error('Error posting tweet:', error);
    process.exit(1);
  }
}

postUTXOAnalysis();
