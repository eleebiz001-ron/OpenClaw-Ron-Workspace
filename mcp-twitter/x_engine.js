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
        res.resume(); // res.consume() is not a function in node https, res.resume() is used to discard data
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
}

async function postWithMedia(text, imageUrl) {
  try {
    let mediaId;
    if (imageUrl) {
      const tempPath = path.join(__dirname, 'temp_image.png');
      console.log('Downloading image from:', imageUrl);
      await downloadImage(imageUrl, tempPath);
      console.log('Uploading media...');
      mediaId = await client.v1.uploadMedia(tempPath);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }

    const payload = { text };
    if (mediaId) {
      payload.media = { media_ids: [mediaId] };
    }

    const tweet = await client.v2.tweet(payload);
    console.log(`SUCCESS: Tweet posted! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED to post tweet:', error);
  }
}

const args = process.argv.slice(2);
const text = args[0];
const imageUrl = args[1];

if (!text) {
  console.log('Usage: node x_engine.js "tweet text" [image_url]');
} else {
  postWithMedia(text, imageUrl);
}
