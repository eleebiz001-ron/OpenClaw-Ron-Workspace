const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function replyToTweet(tweetUrl, text) {
  try {
    console.log(`Target URL: ${tweetUrl}`);
    console.log(`Reply Text: ${text}`);

    const tweetId = tweetUrl.split('/').pop().split('?')[0];
    const { data: createdTweet } = await client.v2.tweet({
      text: text,
      reply: {
        in_reply_to_tweet_id: tweetId
      }
    });

    console.log(`SUCCESS: ID: ${createdTweet.id}`);
  } catch (error) {
    console.error('FAILED:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const url = args[0];
const text = args.slice(1).join(' ');

if (!url || !text) {
  process.exit(1);
}

replyToTweet(url, text);
