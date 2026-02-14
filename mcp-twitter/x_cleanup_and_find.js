const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function processFollowing() {
  const myId = '2017763735809757187';
  console.log('--- Start Pruning and Finding ---');
  
  try {
    // 1. Get current following list
    const following = await client.v2.following(myId, { 
      "user.fields": ["public_metrics", "description", "verified"] 
    });
    
    if (following.data) {
      for (const user of following.data) {
        const followers = user.public_metrics.followers_count;
        const username = user.username.toLowerCase();
        
        // Skip protected/special accounts
        if (username.includes('sophia') || username === 'wsopym') continue;

        // Unfollow if low follower count OR spammy keywords (basic check)
        const spamKeywords = ['fx', 'forex', 'signals', 'profit', 'investment', 'giveaway'];
        const isSpammy = spamKeywords.some(kw => user.description?.toLowerCase().includes(kw));

        if (followers < 1000 || isSpammy) {
          console.log(`Unfollowing @${user.username} (Followers: ${followers}, Spammy: ${isSpammy})`);
          await client.v2.unfollow(myId, user.id);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }

    // 2. Find new high-value targets (Example: searching for influencers in XRP/HBAR)
    const searchTerms = ['XRP whale', 'HBAR official', 'crypto analyst'];
    for (const term of searchTerms) {
      const search = await client.v2.userSearch(term, { max_results: 5 });
      if (search.data) {
        for (const user of search.data) {
          // Additional check could go here
          console.log(`Found potential target: @${user.username}`);
        }
      }
    }
    
    console.log('--- Pruning and Finding Complete ---');
  } catch (e) {
    console.error('Operation failed:', e.message);
  }
}

processFollowing();
