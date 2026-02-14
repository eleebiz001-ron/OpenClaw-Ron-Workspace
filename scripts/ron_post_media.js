const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });
const fs = require('fs');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postWithMedia(text, imagePath) {
  try {
    console.log('Uploading media...');
    const mediaId = await client.v1.uploadMedia(imagePath);
    console.log(`Media uploaded: ${mediaId}`);

    console.log('Posting tweet...');
    const { data: createdTweet } = await client.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] }
    });

    console.log(`SUCCESS: ID: ${createdTweet.id}`);
  } catch (error) {
    console.error('FAILED:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const imagePath = args[0];
const text = args.slice(1).join(' ');

if (!imagePath || !text) {
  process.exit(1);
}

postWithMedia(text, imagePath);
