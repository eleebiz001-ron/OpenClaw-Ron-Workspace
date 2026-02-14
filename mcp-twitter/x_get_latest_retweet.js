const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function getLatestRetweet() {
  try {
    const me = await client.v2.me();
    const timeline = await client.v2.userTimeline(me.data.id, { 
      max_results: 10,
      "tweet.fields": ["referenced_tweets", "created_at"]
    });
    
    for (const tweet of timeline.data.data) {
      if (tweet.referenced_tweets && tweet.referenced_tweets.some(ref => ref.type === 'retweeted')) {
        console.log('Latest Retweet (Original Tweet ID):', tweet.referenced_tweets.find(ref => ref.type === 'retweeted').id);
        console.log('Your Repost ID (Link ID):', tweet.id);
        return;
      }
    }
    console.log('No recent retweets found.');
  } catch (e) {
    console.log('Error:', e.message);
  }
}
getLatestRetweet();
