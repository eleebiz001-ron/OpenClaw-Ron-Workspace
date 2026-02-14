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

async function getHugoTweetContent() {
  try {
    const tweet = await client.v2.singleTweet('2022282965871743112', {
      expansions: ['author_id'],
      'tweet.fields': ['text', 'created_at']
    });
    console.log(JSON.stringify(tweet, null, 2));
  } catch (error) {
    console.error('Error fetching tweet:', error);
  }
}

getHugoTweetContent();
