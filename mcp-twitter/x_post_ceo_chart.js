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
  const text = `The technical signals for $XRP are reaching a critical boiling point. 📊🔥

Looking at the current chart, we’ve just witnessed a massive spike in Daily Volume—the kind of liquidity surge that historically marks a definitive Trend Reversal. While the immediate bounce remains modest, the RSI has plummeted to its lowest level in over a year. We are deep in "Oversold" territory.

Though we must remain vigilant over the coming days, the data suggests this is likely the absolute floor we’ve been searching for since last August. The strategic bottom is forming. 🏗️🚀

#XRP #Ripple #TechnicalAnalysis #RSI #CryptoTrading #MarketInsight #Bullish`;

  const imagePath = path.join(__dirname, 'ceo_expert_chart.jpg');

  try {
    console.log('Uploading CEO Expert Chart...');
    const mediaId = await client.v1.uploadMedia(imagePath);
    
    console.log('Posting tweet...');
    const tweet = await client.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] }
    });
    
    console.log(`SUCCESS: Tweet posted with CEO's expert chart! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

run();
