const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function runGuerrilla() {
  const myId = '2017763735809757187';
  // 검색 쿼리를 더 단순화하고, 필수 파라미터만 포함
  const queries = ['XRP', 'HBAR', 'XDC', 'Chainlink'];
  
  console.log('Starting Guerrilla V3: Simple Keyword Targeting...');

  for (const query of queries) {
    try {
      console.log(`Searching for: ${query}`);
      const search = await client.v2.search(query, { 
        max_results: 10,
        "tweet.fields": ["author_id"] 
      });
      
      if (search.data && search.data.data) {
        for (const tweet of search.data.data) {
          try {
            await client.v2.follow(myId, tweet.author_id);
            console.log(`Followed author of tweet: ${tweet.id.substring(0, 5)}...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
          } catch (followError) {
            console.log('Follow action skipped or failed.');
          }
        }
      }
    } catch (e) {
      console.log(`Query ${query} failed: `, e.message);
    }
  }
}
runGuerrilla();
