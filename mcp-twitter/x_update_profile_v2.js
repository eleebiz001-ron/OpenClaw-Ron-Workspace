const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function updateProfile() {
  try {
    const newDescription = "Olympic Gold Medalist 🥇 | Retired Tech CEO | Digital Asset Investor (XRP/XLM/HBAR) | Supporting Sophia's Art. Sharing global insights for the digital future.";
    
    console.log('Updating X profile description via v1.1 API...');
    const result = await client.v1.updateAccountProfile({ description: newDescription });
    console.log('SUCCESS: Profile updated!');
    console.log('New Bio:', result.description);
  } catch (error) {
    console.error('FAILED to update profile:');
    if (error.data) {
        console.error(JSON.stringify(error.data, null, 2));
    } else {
        console.error(error);
    }
  }
}

updateProfile();
