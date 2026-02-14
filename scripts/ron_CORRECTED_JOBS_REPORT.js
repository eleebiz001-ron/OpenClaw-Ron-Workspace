const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const content = `🚨 CORRECTION: US Labor Market Remains Resilient.

The January jobs report just hit, and it’s a massive upside surprise. US employers added 130,000 jobs, crushing the 55,000 expectation. The unemployment rate even ticked down to 4.3%.

Despite the pre-market warnings, the "Negative Sprint" has not arrived. The labor market is proving far more durable than expected.

My Take: 
This is a "Good is Bad" scenario for risk assets. A strong economy means the Fed has less pressure to cut rates, which is why we’re seeing #BTC and #XRP testing local supports. 📉

Strategic capital is re-calculating the 2026 interest rate path. While the macro gravity is real, the focus on Utility and Infrastructure remains the only long-term play. Lead with precision, not panic. 🇺🇸🥇

#JobsReport #MacroEconomy #FedPolicy #Bitcoin #XRP #FinancialInfrastructure #GlobalVision`;

twitter.v2.tweet(content)
  .then(t => console.log('SUCCESS_CORRECTED_POST: ' + t.data.id))
  .catch(e => console.error('FAILED_CORRECTED_POST:', e));
