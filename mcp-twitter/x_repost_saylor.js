const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runSaylorRepost() {
  try {
    // 1. 마이클 세일러의 최신 트윗 ID 가져오기
    const targetUser = await client.v2.userByUsername('saylor');
    const tweets = await client.v2.userTimeline(targetUser.data.id, { max_results: 5 });
    const targetTweetId = tweets.data.data[0].id;

    console.log('Saylor Target Tweet ID:', targetTweetId);

    // 2. 리포스트 실행
    const myId = '2017763735809757187';
    await client.v2.retweet(myId, targetTweetId);
    
    console.log('SUCCESS: Michael Saylor Repost completed!');
  } catch (error) {
    console.error('FAILED to repost Saylor:', JSON.stringify(error, null, 2));
  }
}

runSaylorRepost();
