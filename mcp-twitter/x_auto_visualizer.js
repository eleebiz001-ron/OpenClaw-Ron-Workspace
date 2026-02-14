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

/**
 * Downloads an image from a URL with a custom User-Agent to bypass some bot blocks.
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Failed to download image. Status Code: ${res.statusCode}`));
      }
    });
  });
}

/**
 * Posts a tweet with media.
 * Supports a local path or a remote URL.
 */
async function postTweetWithVisual(text, imageInput) {
  let mediaId;
  let tempPath;

  try {
    if (imageInput) {
      if (imageInput.startsWith('http')) {
        tempPath = path.join(__dirname, `temp_visual_${Date.now()}.png`);
        console.log('Downloading remote image:', imageInput);
        await downloadImage(imageInput, tempPath);
      } else {
        tempPath = imageInput;
      }

      console.log('Uploading media to X...');
      mediaId = await client.v1.uploadMedia(tempPath);
      
      // Clean up temp file if it was a download
      if (imageInput.startsWith('http') && fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }

    const payload = { text };
    if (mediaId) {
      payload.media = { media_ids: [mediaId] };
    }

    const tweet = await client.v2.tweet(payload);
    console.log(`SUCCESS: Post live! ID: ${tweet.data.id}`);
    return tweet.data.id;
  } catch (error) {
    console.error('ERROR in x_auto_visualizer:', error);
    if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    throw error;
  }
}

// CLI usage
const args = process.argv.slice(2);
if (args.length > 0) {
  postTweetWithVisual(args[0], args[1]);
}

module.exports = { postTweetWithVisual };
