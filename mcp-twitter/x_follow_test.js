const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followUsers() {
  const usersToFollow = ['elonmusk', 'bgarlinghouse', 'Ripple', 'HBAR_Foundation', 'StellarOrg'];
  console.log('Starting strategic following...');
  
  for (const screenName of usersToFollow) {
    try {
      const user = await client.v2.userByUsername(screenName);
      await client.v2.follow('2019330954045812736', user.data.id); // EunLee_Global ID
      console.log(`Successfully followed: ${screenName}`);
    } catch (e) {
      console.log(`Error following ${screenName}: `, e.message);
    }
  }
}

followUsers();
