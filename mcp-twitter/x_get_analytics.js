const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function getImpressions() {
  try {
    const me = await client.v2.me();
    // 최근 10개 트윗의 노출수 합계 가져오기 (tweet.fields: public_metrics 필요)
    const tweets = await client.v2.userTimeline(me.data.id, { 
      max_results: 10,
      "tweet.fields": ["public_metrics", "created_at"]
    });
    
    let totalImpressions = 0;
    console.log('--- Ron\'s Analytics: Last 10 Tweets ---');
    for (const tweet of tweets.data.data) {
      const imp = tweet.public_metrics.impression_count || 0;
      totalImpressions += imp;
      console.log(`[${tweet.created_at.substring(0,10)}] Tweet ID: ${tweet.id} | Impressions: ${imp}`);
    }
    console.log('----------------------------------------');
    console.log('Current Total Impressions (Last 10):', totalImpressions);
  } catch (e) {
    console.log('Analytics Error:', e.message);
  }
}
getImpressions();
