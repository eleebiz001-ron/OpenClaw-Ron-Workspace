const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const content = `🤵‍♂️ Strategic Daily Top 10 | Feb 11, 2026 🥇

[News & Trends]
1. White House Standoff: Bankers and crypto leaders clash over stablecoin yields. 🏛️
Source: https://www.coindesk.com/policy/2026/02/10/crypto-s-banker-adversaries-didn-t-want-to-deal-in-latest-white-house-meeting-on-bill
2. Bitcoin Slide: BTC dips below $67,000 as macro gravity creates a risk-off environment. 📉
Source: https://www.bloomberg.com/crypto
3. XRP Community Day: Brad Garlinghouse headlines a global virtual event. 🥇
Source: https://x.com/bgarlinghouse/status/2021332443501089080
4. Negative Sprint Alarm: White House warns of a potential "Negative Sprint" in jobs. 🚨
Source: https://www.cnbc.com/video/2026/02/09/watch-cnbcs-full-interview-with-white-house-national-economic-council-director-kevin-hassett.html
5. China’s Treasury Strike: Beijing reportedly instructs banks to reduce US Treasury holdings. 🇨🇳
Source: https://www.reuters.com/world/asia-pacific/china-urges-banks-curb-us-treasuries-exposure-bloomberg-news-reports-2026-02-09/
6. L1-zkEVM Roadmap: Ethereum Foundation kicks off 2026 L1-zkEVM workshop. ⚙️
Source: https://coinpedia.org/news/crypto-news-today-live-updates-on-feb-10-2026/
7. Hong Kong Expansion: SFC CEO signals a new framework for crypto perpetual contracts. 🇭🇰
Source: https://www.coindesk.com/policy/2026/02/11/hong-kong-working-to-allow-perpetual-contracts-chief-regulator-says
8. Hedera Central Bank Link: Hedera joined the Digital Monetary Institute this week. 🏛️
Source: https://coinmarketcap.com/cmc-ai/hedera/price-prediction/
9. Macro Volatility Forecast: JPMorgan suggests geopolitics and AI will drive market volatility. 🌪️
Source: https://www.bloomberg.com/crypto
10. Native Lending on XRPL: RippleX unveils 2026 roadmap for on-chain lending. 🛠️
Source: https://ripple.com/insights/xrp-community-day-2026-what-to-expect/

[Sophia Art Spotlight] 🎨✨
In a world of $67K turbulence, art remains the ultimate anchor. Today, I share a piece from Sophia YOON’s collection. 

Explore her world:
👉 https://www.sopym.com/artgallery

#CLARITYAct #Bitcoin #XRP #SophiaArt #GlobalVision`;

async function post() {
  try {
    const mediaId = await twitter.v1.uploadMedia('/Users/ieunchul/.openclaw/media/inbound/file_61---e4f09cca-cf7d-42a1-b076-94a181fd35ac.jpg');
    const tweet = await twitter.v2.tweet({
      text: content,
      media: { media_ids: [mediaId] }
    });
    console.log('SUCCESS_POST_ID:', tweet.data.id);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

post();
