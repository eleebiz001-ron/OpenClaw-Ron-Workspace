const fs = require('fs');
const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;

const twitter = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

const content = process.argv[2];

if (!content) {
  console.error('Usage: node post_to_x.js "Your post content"');
  process.exit(1);
}

async function run() {
  try {
    console.log('--- Posting to X ---');
    const tweet = await twitter.v2.tweet(content);
    console.log(`SUCCESS: Post live! ID: ${tweet.data.id}`);
    
    // Log to memory
    const date = new Date().toISOString().split('T')[0];
    const logPath = `/Users/ieunchul/clawd/memory/x_post_${date}.md`;
    const logEntry = `\n## 🚀 Manual Post: Bithumb Incident Analysis\n- **Time:** ${new Date().toLocaleString()}\n- **ID:** ${tweet.data.id}\n- **Content:**\n${content}\n`;
    fs.appendFileSync(logPath, logEntry);

  } catch (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
}

run();
