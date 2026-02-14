const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const client = twitter.readWrite;

async function followUsers(usernames) {
  for (const username of usernames) {
    try {
      const user = await client.v2.userByUsername(username);
      if (user.data) {
        // To follow someone, we need our own user ID
        const me = await client.v2.me();
        await client.v2.follow(me.data.id, user.data.id);
        console.log(`SUCCESS: Followed @${username}`);
      }
    } catch (e) {
      console.error(`FAILED to follow @${username}:`, e.message);
    }
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node scripts/x_follow.js username1 username2 ...");
  process.exit(1);
}

followUsers(args);
