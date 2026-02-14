const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function followExchangeCEOs() {
  const myId = '2017763735809757187';
  const ceos = [
    '_RichardTeng', // Binance
    'jespow',       // Kraken
    'star_okx',     // OKX
    'benbybit',     // Bybit
    'lyu_johnny',   // KuCoin
    'kris',         // Crypto.com
    'han_gate',     // Gate.io
    'paoloardoino'  // Bitfinex/Tether
  ];

  console.log('Targeting Top 10 Exchange CEOs...');

  for (const handle of ceos) {
    try {
      const user = await client.v2.userByUsername(handle);
      if (user.data) {
        await client.v2.follow(myId, user.data.id);
        console.log(`Successfully followed @${handle}`);
      }
    } catch (e) {
      if (e.message.includes('already following')) {
        console.log(`@${handle} is already followed.`);
      } else {
        console.log(`Error following @${handle}: ${e.message}`);
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}

followExchangeCEOs();
