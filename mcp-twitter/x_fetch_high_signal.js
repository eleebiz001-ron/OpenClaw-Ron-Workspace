const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function getHighSignalTweets() {
  const users = ['bgarlinghouse', 'MonicaLongSF', 'JoelKatz', 'ManceHarmon', 'leemonbaird', 'hedera', 'Ripple'];
  let allTweets = [];

  for (const username of users) {
    try {
      const user = await client.v2.userByUsername(username);
      const tweets = await client.v2.userTimeline(user.data.id, {
        max_results: 5,
        "tweet.fields": ["public_metrics", "text", "created_at"]
      });
      if (tweets.data && tweets.data.data) {
        tweets.data.data.forEach(t => {
          allTweets.push({
            id: t.id,
            text: t.text,
            username: username,
            engagement: t.public_metrics.retweet_count + t.public_metrics.like_count,
            metrics: t.public_metrics
          });
        });
      }
    } catch (e) {
      console.error(`Error fetching ${username}:`, e.message);
    }
  }

  // Sort by engagement
  allTweets.sort((a, b) => b.engagement - a.engagement);
  console.log(JSON.stringify(allTweets.slice(0, 10), null, 2));
}

getHighSignalTweets();
