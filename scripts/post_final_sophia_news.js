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

async function postFinalSophiaFinancialReport() {
  try {
    // 1. Upload Sophia's Art Piece
    const mediaId = await client.v1.uploadMedia('/Users/ieunchul/.openclaw/media/inbound/file_95---4024ca37-373d-4dcb-84ed-f4e0afc9b44d.jpg');

    // 2. Prepare the FULL content (News Top, Sophia Bottom)
    const content = `Here are the top 10 financial news stories as of February 13, 2026, based on major market movements, inflation anticipation, policy updates, and sector developments from reliable sources like CNBC, Reuters, Bloomberg, Yahoo Finance, and others:

1. US Stocks Fall Sharply on Tech Sell-Off and AI Disruption Fears
Major indices declined, with Nasdaq down ~2%, S&P 500 ~1.6%, and Dow ~1.3%, driven by renewed concerns over AI impacting jobs and tech valuations.
[CNBC Live Updates](https://www.cnbc.com/2026/02/11/stock-market-today-live-updates.html) | [Reuters Markets](https://www.reuters.com/markets)

2. Stock Futures Slip Ahead of Key January CPI Inflation Report
Traders are focused on tomorrow's CPI data, expected to influence Fed rate expectations amid recent market volatility.
[CNBC](https://www.cnbc.com/2026/02/12/stock-market-today-live-updates.html) | [Yahoo Finance](https://finance.yahoo.com/news/live/stock-market-today-dow-sp-500-nasdaq-futures-fall-after-ai-stoked-sell-off-with-cpi-inflation-on-deck-234823568.html)

3. Trump Plans to Roll Back Some Steel and Aluminum Tariffs
Policy shift aims to narrow scope of metals tariffs, impacting trade and commodity prices.
[Yahoo Finance](https://finance.yahoo.com/news/live/trump-tariffs-live-updates-trump-rolls-back-duties-on-metals-as-tariffs-face-house-rebuke-220551130.html) | [Financial Times](https://www.ft.com/trump-tariffs)

4. Tech Sell-Off Eases Slightly in Global Markets Wrap
Stocks edge lower before CPI, with AI angst cooling somewhat and money flowing to Asia winners.
[Bloomberg Markets Wrap](https://www.bloomberg.com/news/articles/2026-02-12/stock-market-today-dow-s-p-live-updates-)

5. Russian Central Bank Cuts Key Rate to 15.5%, Signals More Easing
Move reflects policy adjustment amid economic conditions.
[Reuters Finance](https://www.reuters.com/business/finance/russian-central-bank-cuts-key-rate-by-50-basis-points-155-2026-02-13/)

6. JPMorgan Recommends Selling 2-Year Treasurys Ahead of CPI
Positioning advice as markets await inflation data.
[Yahoo Finance](https://finance.yahoo.com/news/jpmorgan-favors-selling-two-treasuries-024047091.html)

7. Apollo and Blackstone Execs Reassure on Software Sell-Off Impact
Private equity leaders address how broader tech/software declines affect their holdings.
[Reuters Finance](https://www.reuters.com/business/finance/apollo-blackstone-execs-offer-reassurance-software-sell-off-hits-their-stocks-2026-02-13/)

8. Deutsche Bank Upgrades Airbnb on Earnings Beat and AI Momentum
Positive analyst move citing strong results and AI tailwinds.
[CNBC](https://www.cnbc.com/2026/02/13/deutsche-bank-upgrades-airbnb-on-earnings-beat-and-ai-momentum.html)

9. Westpac's Quarterly Profit Rises, Shares Hit Record High
Australian bank benefits from loan growth and resilient demand.
[Reuters Finance](https://www.reuters.com/business/finance/westpac-first-quarter-profit-rises-loan-deposit-growth-2026-02-12/)

10. US Debt Poised to Top WWII Record as Deficits Near $3T
Projections highlight growing fiscal concerns with exploding annual deficits.
[Fox Business](https://www.foxbusiness.com/politics/us-debt-set-crush-world-war-ii-record-annual-deficits-explode-3t-within-decade)

Markets remain volatile with eyes on US inflation data and ongoing AI/trade policy debates. For real-time updates, check sources like Bloomberg, Reuters, or CNBC directly!

---

Along with the pulse of the global economy, find peace in art. Discover the gold-infused elegance of Sophia YOON's latest works. 🎨✨

✨ View Gallery: https://www.sopym.com/artgallery

#Economy #Finance #MarketUpdate #SophiaYoon #ArtGallery #XRP #Utility #CantonNetwork`;

    // 3. Post as a Single Long Tweet (Premium Feature)
    const tweet = await client.v2.tweet({
      text: content,
      media: { media_ids: [mediaId] }
    });

    console.log('Successfully posted the final consolidated report:', tweet.data.id);
  } catch (error) {
    console.error('Error posting final report:', error);
  }
}

postFinalSophiaFinancialReport();
