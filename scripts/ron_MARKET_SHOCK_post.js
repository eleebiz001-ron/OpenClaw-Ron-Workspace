const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const postContent = `The market is bracing for a double shock tonight. Reports of a "Negative Sprint" in US jobs data (via @CNBC) and China’s reported instruction to curb US Treasury exposure have created a "perfect storm" for risk assets. 📈📉

My Take: 
We are already seeing this being priced-in. The recent dip in #XRP below $1.40 and broader market liquidations suggest that strategic capital is already moving to the sidelines. This isn't just a reaction; it's a defensive pre-emption of macro gravity.

Expect short-term turbulence. Digital assets, even utility-heavy networks like #XRP, #XLM, and #HBAR, are facing a "risk-off" test. 

However, look past the red candles. This volatility proves exactly why the world needs more efficient, national-grade financial infrastructure. When traditional rails tremble, the value of resilient, high-speed utility becomes undeniable.

Short-term pain, long-term blueprint. We lead through the storm. 🇺🇸🥇

#MacroEconomy #JobsReport #MarketAnalysis #XRP #HBAR #XLM #FinancialInfrastructure #GlobalVision`;

async function post() {
  try {
    const tweet = await twitter.v2.tweet(postContent);
    console.log(`SUCCESS_MARKET_SHOCK: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED_MARKET_SHOCK:', error);
  }
}

post();
