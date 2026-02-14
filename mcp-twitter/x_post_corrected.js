const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();
const fs = require('fs');
const https = require('https');
const path = require('path');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.consume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
}

async function run() {
  const text = `🚨 Top 5 Crypto News Summary 🚨

1️⃣ Bitcoin plunges 15%, dipping below $61K as sell-off pressure mounts.
2️⃣ Over $2.7B liquidated in 24 hrs, shaking the market.
3️⃣ 92/100 top cryptos in the red, signaling widespread decline.
4️⃣ XRP falls 10.6% to $1.43, leading losses among top 10 coins.
5️⃣ Analysts warn of 'full capitulation mode' as key averages break.

---

In times of market turbulence, finding a moment of peace is essential. Beyond the charts and volatility, I find my balance in the world of art. 

If you need a mental break today, I invite you to explore the serene beauty of Sophia's Art Gallery: 
👉 https://www.sopym.com/artgallery

#CryptoNews #Bitcoin #MarketUpdate #Art #Serenity`;

  const imageUrl = "https://static.wixstatic.com/media/989f5e_0ad364e42c204ba7ac69decd74787a05~mv2.png";
  const tempPath = path.join(__dirname, 'temp_fix_image.png');

  try {
    console.log('Downloading image...');
    await downloadImage(imageUrl, tempPath);
    
    console.log('Uploading media...');
    const mediaId = await client.v1.uploadMedia(tempPath);
    
    console.log('Posting tweet...');
    const tweet = await client.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] }
    });
    
    console.log(`SUCCESS: Tweet posted! ID: ${tweet.data.id}`);
    fs.unlinkSync(tempPath);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

run();
