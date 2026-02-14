const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postMacroAlert(indicator, actual, expected, insight) {
  const content = `🚨 BREAKING: US ${indicator} Report (Jan 2026)\n\n🔹 Actual: ${actual}\n🔹 Expected: ${expected}\n\n${insight}\n\n#MacroEconomy #ClarityAct #Utility #FinancialInfrastructure #USGlobalVision`;
  
  try {
    const tweet = await twitter.v2.tweet(content);
    console.log(`SUCCESS: Macro Alert posted! ID: ${tweet.data.id}`);
    
    // Cross-verification: Fetch back the tweet to ensure accuracy
    const verify = await twitter.v2.singleTweet(tweet.data.id);
    if (verify.data.text.includes(actual)) {
      console.log('VERIFIED: Content matches.');
    } else {
      console.log('ALERT: Verification failed. Possible content mismatch.');
    }
  } catch (error) {
    console.error('FAILED:', error);
  }
}

// Example usage via command line args
const args = process.argv.slice(2);
if (args.length >= 4) {
    postMacroAlert(args[0], args[1], args[2], args[3]);
} else {
    console.log('Usage: node macro_alert_system.js "Indicator" "Actual" "Expected" "Insight"');
}
