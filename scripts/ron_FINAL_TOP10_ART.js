const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
const fs = require('fs');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const content = `Reports from the recent White House meeting reveal a deepening divide between the banking and crypto sectors. America cannot afford a stalemate. We need the CLARITY Act to pass now to secure the global financial rails for the next century. 🇺🇸🥇

Daily News & Trends Top 10 (Feb 11, 2026) 🤵‍♂️📉

1. Macro Shock: White House warns of "Negative Sprint" in jobs data.
2. China Strike: Instructions to curb US Treasury exposure sending yields higher.
3. Fed Dilemma: Employment vs. Inflation—the wait-and-see game continues.
4. Bitcoin Resilience: $86k-$90k range holding despite macro gravity.
5. XRP Community Day: Ripple leadership outlines 2026 focus on institutional rails.
6. RLUSD Debut: New stablecoin becoming the compliant bridge for tokenized assets.
7. AI Machine Economy: Agents transacting autonomously is the next big shift.
8. M&A Wave: Consolidation starting among mid-tier crypto projects.
9. TradFi Integration: Legacy banks adopting RWA via private ledgers.
10. Privacy Infrastructure: ZKPs becoming core to institutional digital finance.

[Sophia Art Spotlight] 🎨✨
In a world of high-speed data, art remains the ultimate anchor of the human soul. Today, I share a piece from Sophia YOON’s collection. 

Explore her world:
👉 https://www.sopym.com/artgallery

#CLARITYAct #XRP #SophiaArt #GlobalVision`;

async function postWithMedia() {
  try {
    // Upload the image
    const mediaId = await twitter.v1.uploadMedia('/Users/ieunchul/.openclaw/media/inbound/file_61---e4f09cca-cf7d-42a1-b076-94a181fd35ac.jpg');
    console.log('MEDIA_UPLOAD_SUCCESS:', mediaId);

    // Post the tweet with media
    const tweet = await twitter.v2.tweet({
      text: content,
      media: { media_ids: [mediaId] }
    });
    console.log('SUCCESS_FINAL_POST:', tweet.data.id);
  } catch (error) {
    console.error('CRITICAL_POST_ERROR:', error);
  }
}

postWithMedia();
