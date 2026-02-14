const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function cleanup() {
  const myId = '2017763735809757187';
  try {
    const tweets = await client.v2.userTimeline(myId, { max_results: 20 });
    const seen = new Set();
    for (const tweet of tweets.data.data) {
      if (seen.has(tweet.text)) {
        console.log(`Deleting duplicate: ${tweet.id}`);
        await client.v2.deleteTweet(tweet.id);
      } else {
        seen.add(tweet.text);
      }
    }
    console.log('Cleanup finished.');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

cleanup();
