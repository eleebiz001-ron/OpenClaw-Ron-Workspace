const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followRippleElites() {
  const myId = '2017763735809757187';
  const rippleElites = [
    'JoelKatz',      // David Schwartz (CTO)
    'MonicaLongSF',  // Monica Long (Ripple President)
    'chrislarsensf', // Chris Larsen (Co-founder)
    'emy_wng',       // Emi Yoshikawa (VP, Strategy)
    'sentosumosaba'  // Influential Ripple Analyst
  ];

  console.log('Adding Ripple Elites (Fixed Script) to our 589 Army...');

  for (const username of rippleElites) {
    try {
      const user = await client.v2.userByUsername(username);
      if (user && user.data) {
        await client.v2.follow(myId, user.data.id);
        console.log(`Successfully followed Ripple Leader: @${username}`);
      }
    } catch (e) {
      console.log(`Status for @${username}: `, e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

followRippleElites();
