const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });
const fs = require('fs');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postWithMedia() {
  try {
    const imagePath = "/Users/ieunchul/.openclaw/media/inbound/file_65---758557c7-fce1-4b1d-9ac0-b23ced71fc34.jpg";
    const text = `XRP Ledger leaps to #6 in the RWA League Table, surging +159.3% in 30 days! 🚀

The 2026 Roadmap confirms XRPL is no longer just for payments; it’s the core OS for Institutional DeFi:

1️⃣ pDEX & Permissioned Domains: Regulated FX flows & compliance.
2️⃣ MPT (Multi-Purpose Tokens): Scaling Tokenized MMFs & Bonds.
3️⃣ Native Lending (XLS-66): Unlocking multi-billion dollar yield opportunities.

We are witnessing the final integration of digital assets into the global financial plumbing. XRP sits at the center. Precision meets scale. 🥇

#XRP #XRPL #RWA #InstitutionalDeFi #UtilityWins`;

    console.log('Uploading media...');
    const mediaId = await client.v1.uploadMedia(imagePath);
    
    console.log('Posting tweet...');
    const { data: createdTweet } = await client.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] }
    });

    console.log(`SUCCESS: ID: ${createdTweet.id}`);
  } catch (error) {
    console.error('FAILED:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

postWithMedia();
