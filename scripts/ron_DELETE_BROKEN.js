const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

twitter.v2.deleteTweet('2021567576590135764')
  .then(() => console.log('DELETED_BROKEN: 2021567576590135764'))
  .catch(e => console.error('DELETE_FAILED (might be already gone):', e));
