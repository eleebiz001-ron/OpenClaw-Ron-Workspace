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
    const timeline = await client.v2.userTimeline(me.data.id, { 
        max_results: 10
    });

    for (const tweet of timeline.data.data) {
      if (tweet.text.includes('\\n') || tweet.text.includes('--action') || tweet.text.includes('delete_recent')) {
        console.log(`Deleting broken tweet: ${tweet.text}`);
        await client.v2.deleteTweet(tweet.id);
      }
    }
  } catch (e) {
    console.error('Cleanup failed:', e);
  }
}

cleanup();
