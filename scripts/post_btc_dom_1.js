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

async function postWithImages() {
  try {
    const mediaIds = await Promise.all([
      client.v1.uploadMedia('/Users/ieunchul/.openclaw/media/inbound/file_78---e9838129-fd5f-4a38-a155-d10feeef21a2.jpg'),
      client.v1.uploadMedia('/Users/ieunchul/.openclaw/media/inbound/file_79---4b43a0ac-bce2-4a90-8b90-9370759e59aa.jpg')
    ]);

    const tweet = await client.v2.tweet({
      text: "The era of Bitcoin dominance is shifting. After peaking at 66%, BTC.D is struggling to reclaim its uptrend channel. The charts don't lie: we are witnessing a structural pivot. 📉\n\nWith the upcoming 'Clarity' legislation and pro-crypto policies, the focus is moving from speculative assets to Utility-driven Altcoins. This isn't about BTC falling; it's about the market expanding toward next-gen financial infrastructure. Expect BTC.D to target 49% or even 39% as real utility takes the lead. 🚀\n\n#BTC #Altseason #Utility #CryptoClarity #XRP #XLM #HBAR #BlockchainInfrastructure",
      media: { media_ids: mediaIds }
    });

    console.log('Successfully posted tweet:', tweet.data.id);
  } catch (error) {
    console.error('Error posting tweet:', error);
    process.exit(1);
  }
}

postWithImages();
