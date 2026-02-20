const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

// secrets/x.env 파일 로드 및 파싱
const envPath = path.join(__dirname, '..', 'secrets', 'x.env');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(line => line.includes('='))
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    acc[key.trim()] = value.join('=').trim();
    return acc;
  }, {});

const client = new TwitterApi({
  appKey: envConfig.X_API_KEY,
  appSecret: envConfig.X_API_SECRET,
  accessToken: envConfig.X_ACCESS_TOKEN,
  accessSecret: envConfig.X_ACCESS_SECRET,
});

async function postWithMedia() {
  const text = process.argv[2];
  const imagePath = process.argv[3];

  try {
    console.log('Uploading media...');
    const mediaId = await client.v1.uploadMedia(imagePath);
    console.log('Media uploaded. ID:', mediaId);

    const tweet = await client.v2.tweet(text, {
      media: { media_ids: [mediaId] }
    });
    console.log(`Successfully posted tweet with media! ID: ${tweet.data.id}`);
  } catch (e) {
    console.error('Error posting tweet: ', e.data || e.message);
  }
}

postWithMedia();
