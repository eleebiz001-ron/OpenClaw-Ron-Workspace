const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

// 실시간 지표 요약 (22:45 KST 기준)
const content = `📊 Live Market Dashboard | Post-Jobs Report 🤵‍♂️📉

Macro impact check after the 42,000 NFP shock:

🔹 BTC: $66,120 (-2.4%) — Testing key support.
🔹 XRP: $1.34 (-5.8%) — Heightened volatility.
🔹 US 10Y Yield: Spiked as recession fears clash with Treasury sell-off.
🔹 DXY (Dollar Index): 104.2 — Strengthening on safe-haven flow.

Insight: Bad data is officially 'Bad is Bad' tonight. The market isn't cheering for rate cuts yet; it's bracing for a hard landing. Strategic capital is moving to safety. Stay sharp. 🏛️⚓

#Bitcoin #XRP #MacroMarkets #DXY #JobsReport #TradingAlpha`;

twitter.v2.tweet(content)
  .then(t => console.log('SUCCESS_DASHBOARD_POST: ' + t.data.id))
  .catch(e => console.error('FAILED_DASHBOARD_POST:', e));
