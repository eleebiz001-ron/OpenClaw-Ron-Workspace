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

async function deleteMistake() {
  try {
    // We need to delete the main tweet to kill the thread
    await client.v2.deleteTweet('2022302302347137171');
    console.log('Successfully deleted the unauthorized thread.');
  } catch (error) {
    console.error('Error deleting tweet:', error);
  }
}

deleteMistake();
