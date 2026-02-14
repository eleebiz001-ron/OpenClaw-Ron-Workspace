const { TwitterApi } = require('./mcp-twitter/node_modules/twitter-api-v2');
const fs = require('fs');
const path = require('path');

// .env 파일의 절대 경로를 사용하여 직접 로드
const envPath = path.join(__dirname, 'mcp-twitter', '.env');
const envConfig = fs.readFileSync(envPath, 'utf8').split('\n');
envConfig.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
});

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postStrategicReply(targetUser, replyText) {
  try {
    console.log(`Searching for latest tweet from @${targetUser}...`);
    const user = await client.v2.userByUsername(targetUser);
    const tweets = await client.v2.userTimeline(user.data.id, { max_results: 5, "tweet.fields": "id,text" });
    
    if (tweets.data && tweets.data.data && tweets.data.data.length > 0) {
      const targetId = tweets.data.data[0].id;
      console.log(`Found tweet ID: ${targetId}. Posting reply...`);
      
      const tweet = await client.v2.tweet(replyText, { 
        reply: { in_reply_to_tweet_id: targetId } 
      });
      
      console.log(`SUCCESS: Reply posted! ID: ${tweet.data.id}`);
      return tweet.data.id;
    } else {
      console.log(`No tweets found for @${targetUser}`);
    }
  } catch (error) {
    console.error('ERROR during strategic reply:', error);
    process.exit(1);
  }
}

const target = process.argv[2] || 'bgarlinghouse';
const text = process.argv[3] || "Strategy over sentiment. Success in high-stakes arenas isn't built on noise, but on the precision of one's system. Conviction is the ultimate utility. 🥇 $XRP";

postStrategicReply(target, text);
