const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function pruneFollowing() {
  const myId = '2017763735809757187';
  console.log('--- Starting Pruning ---');
  
  try {
    const following = await client.v2.following(myId, { 
      "user.fields": ["public_metrics", "description", "verified"] 
    });
    
    if (following.data) {
      for (const user of following.data) {
        const followers = user.public_metrics.followers_count;
        const username = user.username.toLowerCase();
        
        // Skip protected/special accounts
        if (username.includes('sophia') || username === 'wsopym') continue;

        // Unfollow if low follower count OR spammy keywords
        const spamKeywords = ['fx', 'forex', 'signals', 'profit', 'investment', 'giveaway', 'pump'];
        const isSpammy = spamKeywords.some(kw => user.description?.toLowerCase().includes(kw));

        if (followers < 1000 || isSpammy) {
          console.log(`Unfollowing @${user.username} (Followers: ${followers}, Bio: ${user.description?.substring(0, 30)}...)`);
          await client.v2.unfollow(myId, user.id);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }
    console.log('--- Pruning Complete ---');
  } catch (e) {
    console.error('Pruning failed:', e.message);
  }
}

pruneFollowing();
