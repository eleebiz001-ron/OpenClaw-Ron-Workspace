const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runStrategicRepost() {
  try {
    // 1. 브래드 갈링하우스의 최신 트윗 ID 가져오기 (가장 임팩트 있는 타겟)
    const targetUser = await client.v2.userByUsername('bgarlinghouse');
    const tweets = await client.v2.userTimeline(targetUser.data.id, { max_results: 5 });
    const targetTweetId = tweets.data.data[0].id;

    console.log('Target Tweet ID to Repost:', targetTweetId);

    // 2. 리포스트(리트윗) 실행
    const myId = '2017763735809757187';
    await client.v2.retweet(myId, targetTweetId);
    
    console.log('SUCCESS: Strategic Repost (Retweet) completed!');
  } catch (error) {
    console.error('FAILED to repost:', JSON.stringify(error, null, 2));
  }
}

runStrategicRepost();
