const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const content = `🚨 BREAKING: US Jobs Shock is Real.

The January jobs report just hit, and it’s a massive miss. Nonfarm payrolls grew by only 42,000, far below the 70,000 expected. The unemployment rate has ticked up to 4.5%.

The "Negative Sprint" is no longer a warning—it’s here. The labor market is cooling faster than many anticipated, putting the Fed in a high-pressure position.

My Take: 
Macro gravity is pulling everything down. We are seeing immediate volatility in #BTC and #XRP as the "Recession" narrative takes over. But remember: in times of systemic instability, the push for regulatory clarity and robust infrastructure only becomes more urgent. 

Stay sharp. The next few hours will define the short-term trend. 📉🏛️🇺🇸🥇

#JobsReport #MacroEconomy #Recession #Bitcoin #XRP #ClarityAct #FinancialInfrastructure`;

twitter.v2.tweet(content)
  .then(t => console.log('SUCCESS_EMERGENCY_POST: ' + t.data.id))
  .catch(e => console.error('FAILED_EMERGENCY_POST:', e));
