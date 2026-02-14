const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function run() {
  const text = `Looking at the $XRP and $HBAR charts, we see a classic consolidation phase before the next breakout. In the world of digital assets, volatility is the price of admission for future gains. Technicals are aligning with the coming regulatory clarity. 📊🚀

Strategic patience often rewards those who look beyond the daily noise. Stay focused on the utility.

#XRP #HBAR #CryptoAnalysis #Bullish #Utility #MarketStrategy`;

  const imagePath = path.join(__dirname, 'chart_final.png');

  try {
    console.log('Uploading media from local file...');
    const mediaId = await client.v1.uploadMedia(imagePath);
    
    console.log('Posting tweet...');
    const tweet = await client.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] }
    });
    
    console.log(`SUCCESS: Tweet posted with chart! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

run();
