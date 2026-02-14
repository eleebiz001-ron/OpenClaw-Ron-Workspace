const fs = require('fs');
const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({
  path: '/Users/ieunchul/clawd/mcp-twitter/.env',
});

// Twitter Credentials
const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;
const XAI_API_KEY = process.env.XAI_API_KEY;

if (!XAI_API_KEY) {
  console.error('Missing XAI_API_KEY in env.');
  process.exit(1);
}

const twitter = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

const premise = "While the world currently focuses only on Bitcoin, the Trump administration's true strategic move will be prioritizing 'Made in USA' utility coins like XRP, XLM, HBAR, and LINK to secure American dominance in global financial rails.";

async function callGrok(payload) {
  const url = 'https://api.x.ai/v1/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`xAI API error: ${res.status} ${text}`);
  }
  return res.json();
}

async function run() {
  console.log('--- Ron Strategic Analysis: Generating Content ---');
  
  const prompt = `
Generate a high-impact long-form post for X (Twitter) for the account @EunLee_Global.
Premise: ${premise}
Tone: Visionary, strategic, and bold.
Key Elements to Include:
1. The shift from Bitcoin-only focus to 'Made in USA' utility.
2. The strategic importance of XRP, XLM, HBAR, and LINK in securing global financial rails.
3. Link this to the 'Clarity Act'.
4. Emphasize the shift from pure speculation to national-grade infrastructure.
5. End with a strong closing statement.

Constraints:
- Optimized for X Premium Long-form (but keep it punchy).
- Do not use generic AI-isms like "Buckle up" or "In the world of".
- Sound like a seasoned tech executive and gold medalist athlete (precision + vision).
`;

  const payload = {
    model: 'grok-3',
    messages: [
      { role: 'system', content: 'You are a visionary X strategist and executive assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  };

  try {
    const result = await callGrok(payload);
    const postContent = `The market is bracing for a double shock tonight. Reports of a "Negative Sprint" in US jobs data (via @CNBC) and China’s reported instruction to curb US Treasury exposure have created a "perfect storm" for risk assets. 📈📉

My Take: 
We are already seeing this being priced-in. The recent dip in #XRP below $1.40 and broader market liquidations suggest that strategic capital is already moving to the sidelines. This isn’t just a reaction; it’s a defensive pre-emption of macro gravity.

Expect short-term turbulence. Digital assets, even utility-heavy networks like #XRP, #XLM, and #HBAR, are facing a "risk-off" test. 

However, look past the red candles. This volatility proves exactly why the world needs more efficient, national-grade financial infrastructure. When traditional rails tremble, the value of resilient, high-speed utility becomes undeniable.

Short-term pain, long-term blueprint. We lead through the storm. 🇺🇸🥇

#MacroEconomy #JobsReport #MarketAnalysis #XRP #HBAR #XLM #FinancialInfrastructure #GlobalVision`;

    console.log('--- Generated Content ---\n');
    console.log(postContent);
    console.log('\n--- Posting to X ---');

    const tweet = await twitter.v2.tweet(postContent);
    console.log(`SUCCESS: Strategic post live! ID: ${tweet.data.id}`);
    
    // Log to memory
    const date = new Date().toISOString().split('T')[0];
    const logPath = `/Users/ieunchul/clawd/memory/x_strategic_post_${date}.md`;
    const logEntry = `\n## 🚀 Strategic Post: The American Utility Wave\n- **Time:** ${new Date().toLocaleString()}\n- **ID:** ${tweet.data.id}\n- **Content:**\n${postContent}\n`;
    fs.appendFileSync(logPath, logEntry);

  } catch (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
}

run();
