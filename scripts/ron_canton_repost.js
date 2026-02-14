const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postWithMultiMedia() {
  try {
    const imagePaths = [
      "/Users/ieunchul/.openclaw/media/inbound/file_68---931cebf3-0e8d-41f9-a402-a4676e316844.jpg",
      "/Users/ieunchul/.openclaw/media/inbound/file_69---e7cd734f-8ff7-4385-b51b-cc693f228d9d.jpg",
      "/Users/ieunchul/.openclaw/media/inbound/file_70---135d6a6d-e8ad-40b6-ba80-619a8c420625.jpg",
      "/Users/ieunchul/.openclaw/media/inbound/file_71---e7317aae-700d-4896-9f46-c316c326e39b.jpg"
    ];

    const text = `The institutional footprint on @CantonNetwork is expanding rapidly. 🏦💻

OKX Exchange, a Canton validator since last November, is now officially listing Canton Coin (CC). This follows a clear pattern of infrastructure participation leading to market availability.

The big question now: When will the other major validators follow suit? 🧐

🔹 BinanceUS: Running nodes since Aug 2025.
🔹 Binance: Joined the network in Oct 2025.
🔹 Upbit: Active validator since early this year.

History shows that running a node is the ultimate precursor to full ecosystem integration. We are watching the next generation of financial rails being built in real-time. 🥇

#CantonNetwork #CantonCoin #OKX #Binance #Upbit #InstitutionalInflow #RWA`;

    const quoteTweetId = "2021795255494832231";

    console.log('Uploading 4 media files...');
    const mediaIds = await Promise.all(imagePaths.map(path => client.v1.uploadMedia(path)));
    console.log(`Media uploaded: ${mediaIds.join(', ')}`);

    console.log('Posting quote tweet with 4 images...');
    const { data: createdTweet } = await client.v2.tweet({
      text: text,
      quote_tweet_id: quoteTweetId,
      media: { media_ids: mediaIds }
    });

    console.log(`SUCCESS: ID: ${createdTweet.id}`);
  } catch (error) {
    console.error('FAILED:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

postWithMultiMedia();
