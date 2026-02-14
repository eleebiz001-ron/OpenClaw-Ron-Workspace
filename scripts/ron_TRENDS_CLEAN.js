const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const content = `Daily News & Trends Top 10 (Feb 11, 2026) 🤵‍♂️📉

1. Macro Shock: White House warns of "Negative Sprint" in jobs data. Markets on edge. 
2. China Strike: Instructions to curb US Treasury exposure sending yields higher. 
3. Fed Dilemma: Employment vs. Inflation—the wait-and-see game continues. 
4. Bitcoin Resilience: $86k-$90k range holding despite macro gravity. 
5. XRP Community Day: Ripple leadership outlines 2026 focus on institutional rails. 
6. RLUSD Debut: New stablecoin becoming the compliant bridge for tokenized assets. 
7. AI Machine Economy: Agents transacting autonomously is the next big shift. 
8. M&A Wave: Consolidation starting among mid-tier crypto projects. 
9. TradFi Integration: Legacy banks adopting RWA via private ledgers. 
10. Privacy Infrastructure: ZKPs becoming core to institutional digital finance.

Insight: Short-term turbulence is pre-empting a long-term infrastructure flip. We lead through the storm. 🇺🇸🥇

#MacroNews #XRP #Bitcoin #FinancialTrends #GlobalVision`;

twitter.v2.tweet(content).then(t => console.log('SUCCESS_CLEAN: ' + t.data.id)).catch(e => console.error(e));
