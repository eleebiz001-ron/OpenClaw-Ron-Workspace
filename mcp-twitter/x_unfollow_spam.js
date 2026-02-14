const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function unfollowSpam() {
  const myId = '2017763735809757187';
  const targetUsername = 'Forex737298';
  
  console.log(`Searching for spammer @${targetUsername} to unfollow...`);
  
  try {
    const user = await client.v2.userByUsername(targetUsername);
    if (user && user.data) {
      await client.v2.unfollow(myId, user.data.id);
      console.log(`SUCCESS: Unfollowed @${targetUsername} as per Representative's order.`);
    }
  } catch (e) {
    console.log('Error during unfollow:', e.message);
  }
}

unfollowSpam();
