const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
}).readWrite;

async function cleanup() {
  try {
    const me = await client.v2.me();
    console.log(`Checking tweets for user: ${me.data.username} (ID: ${me.data.id})`);

    const timeline = await client.v2.userTimeline(me.data.id, { 
        max_results: 10,
        "tweet.fields": ["text", "created_at"]
    });

    for (const tweet of timeline.data.data) {
      const isBadAction = tweet.text.includes('--action') || tweet.text.includes('delete_recent');
      const isOldTrump = tweet.text.includes('Merry Christmas') || tweet.text.includes('@Trump');
      const isBadBunny = tweet.text.includes('Bad Bunny');

      if (isBadAction || isOldTrump || isBadBunny) {
        console.log(`Deleting tweet: [${tweet.created_at}] ${tweet.text}`);
        await client.v2.deleteTweet(tweet.id);
        console.log(`SUCCESS: Deleted ${tweet.id}`);
      }
    }
  } catch (e) {
    console.error('Cleanup failed:', e);
  }
}

cleanup();
