const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function findNewElites() {
  const myId = '2017763735809757187';
  const queries = ['$XRP', '$HBAR', '$XDC', '$FLR', '$LINK', 'ISO20022'];
  
  console.log('Searching for new high-value targets...');

  for (const query of queries) {
    try {
      console.log(`Searching for: ${query}`);
      const search = await client.v2.search(query, { 
        max_results: 20,
        "expansions": ["author_id"],
        "user.fields": ["public_metrics", "description", "verified"]
      });
      
      if (search.data && search.includes && search.includes.users) {
        for (const user of search.includes.users) {
          const followers = user.public_metrics.followers_count;
          if (followers > 5000) { // Increased threshold to 5000 for "high value"
             console.log(`Attempting to follow @${user.username} (Followers: ${followers})`);
             try {
                await client.v2.follow(myId, user.id);
                console.log(`Successfully followed @${user.username}`);
             } catch (err) {
                console.log(`Failed to follow @${user.username}: ${err.message}`);
             }
          }
        }
      }
    } catch (e) {
      console.log(`Search for ${query} failed: `, e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
findNewElites();
