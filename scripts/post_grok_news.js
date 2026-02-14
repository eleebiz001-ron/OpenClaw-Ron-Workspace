const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postFinancialNews() {
  try {
    // Grok's summary as requested by user
    const mainTweet = "Here are the top 10 financial news stories as of February 13, 2026, based on major market movements, inflation anticipation, and policy updates:\n\n1. US Stocks Fall Sharply on Tech Sell-Off\n2. Stock Futures Slip Ahead of Key CPI Report\n3. Trump Plans to Roll Back Tariffs\n(Full list in thread below) 🧵🏛️";

    const thread1 = "4. Tech Sell-Off Eases in Global Markets\n5. Russian Central Bank Cuts Key Rate to 15.5%\n6. JPMorgan Recommends Selling 2-Year Treasurys\n7. Apollo and Blackstone Reassure on Software Impact\n8. Deutsche Bank Upgrades Airbnb";

    const thread2 = "9. Westpac's Quarterly Profit Rises\n10. US Debt Poised to Top WWII Record as Deficits Near $3T\n\nMarkets remain volatile with eyes on US inflation data. Precision drives progress. 🥇\n\n#Finance #Economy #MarketUpdate #USA #CPI";

    const t1 = await client.v2.tweet(mainTweet);
    const t2 = await client.v2.reply(thread1, t1.data.id);
    const t3 = await client.v2.reply(thread2, t2.data.id);

    console.log('Successfully posted Financial News Thread:', t1.data.id);
  } catch (error) {
    console.error('Error posting news:', error);
  }
}

postFinancialNews();
