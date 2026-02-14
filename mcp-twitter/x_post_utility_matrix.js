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
  const text = `Stop looking at the price ticker and start looking at the Functional Matrix. 📊🔍

The real value of $XRP isn't built on retail hype—it's engineered into the core infrastructure of global finance. From Auto-bridging in remittance to Tokenized Collateral and Compliance-ready rails, the use cases are operational. 

As a former tech CEO, I prioritize systems that solve real-world inefficiencies. XRP is the logical bridge between legacy banking and the digital future. 🏦🌐

Study the utility. 🛠️📈

#XRP #Ripple #XRPL #Utility #DigitalFinance #InstitutionalAdoption`;

  const imagePath = path.join(__dirname, 'xrp_utility_matrix.jpg');

  try {
    console.log('Uploading Utility Matrix Image...');
    const mediaId = await client.v1.uploadMedia(imagePath);
    
    console.log('Posting tweet...');
    const tweet = await client.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] }
    });
    
    console.log(`SUCCESS: Tweet posted with matrix! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

run();
