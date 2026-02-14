const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function verifyMe() {
  try {
    const me = await client.v2.me();
    console.log('My ID:', me.data.id);
    console.log('My Name:', me.data.name);
    console.log('My Username:', me.data.username);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
verifyMe();
