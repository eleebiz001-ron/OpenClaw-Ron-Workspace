const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followUser(username) {
  const myId = '2017763735809757187';
  try {
    const user = await client.v2.userByUsername(username);
    if (user && user.data) {
      await client.v2.follow(myId, user.data.id);
      console.log(`SUCCESS: Followed @${username} (ID: ${user.data.id})`);
    } else {
      console.error(`ERROR: User @${username} not found.`);
    }
  } catch (error) {
    console.error(`FAILED to follow @${username}:`, JSON.stringify(error, null, 2));
  }
}

const target = process.argv[2];
if (target) {
  followUser(target);
} else {
  console.log('Usage: node x_follow_single.js username');
}
