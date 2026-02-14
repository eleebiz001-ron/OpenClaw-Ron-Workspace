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

async function postSophiaFinancialThread() {
  try {
    // IMAGE UPLOAD FIRST
    const mediaId = await client.v1.uploadMedia('/Users/ieunchul/.openclaw/media/inbound/file_95---4024ca37-373d-4dcb-84ed-f4e0afc9b44d.jpg');

    // MAIN TWEET (Image + Intro + News 1-3)
    const mainText = "Here are the top 10 financial news stories as of Feb 13, 2026. Along with the pulse of the global economy, find peace in art. Discover the elegance of Sophia YOON's works.\n\n✨ View Gallery: https://www.sopym.com/artgallery\n\n1. US Stocks Fall Sharply on Tech Sell-Off\nCNBC: https://www.cnbc.com\n\n2. Stock Futures Slip Ahead of CPI\nYahoo: https://finance.yahoo.com\n\n3. Trump Tariff Rollback Plans\nFT: https://www.ft.com\n\n(Thread continued...) 🧵";

    // THREAD 1 (News 4-7)
    const thread1 = "4. Tech Sell-Off Eases in Global Markets\nBloomberg: https://www.bloomberg.com\n\n5. Russian Central Bank Cuts Rate to 15.5%\nReuters: https://www.reuters.com\n\n6. JPMorgan Recommends Selling 2-Year Treasurys\nYahoo: https://finance.yahoo.com\n\n7. Apollo and Blackstone Reassure on Software\nReuters: https://www.reuters.com";

    // THREAD 2 (News 8-10 + Closing)
    const thread2 = "8. Deutsche Bank Upgrades Airbnb\nCNBC: https://www.cnbc.com\n\n9. Westpac's Quarterly Profit Rises\nReuters: https://www.reuters.com\n\n10. US Debt Poised to Top WWII Record\nFox: https://www.foxbusiness.com\n\nPrecision in finance, elegance in art. 🥇🎨\n\n#Finance #MarketUpdate #SophiaYoon #ArtGallery";

    // LOGGING FOR USER APPROVAL
    console.log("--- DRAFT FOR APPROVAL ---");
    console.log(mainText);
    console.log("---");
    console.log(thread1);
    console.log("---");
    console.log(thread2);
    console.log("--------------------------");

  } catch (error) {
    console.error('Error preparing draft:', error);
  }
}

postSophiaFinancialThread();
