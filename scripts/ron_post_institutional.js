const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function postWithMedia() {
  try {
    const imagePath = "/Users/ieunchul/.openclaw/media/inbound/file_67---3948b695-46ba-43ef-8da0-f8524b873759.jpg";
    const text = `What XRP is Preparing for Institutional Dominance 🏦🥇

The XRP Ledger is systematically building the end-to-end infrastructure required for the world’s largest financial institutions. The 2026 roadmap is moving from 'Vision' to 'Execution':

1️⃣ Permissioned Domains & DEX: Gating institutional FX and RWA markets with full compliance and KYC/AML controls. (v2.5.0 Amendments live)
2️⃣ Native Lending Protocol (XLS-66): Unlocking on-chain credit markets and high-grade yield opportunities for institutional capital. (v3.1.0 Voting in progress)
3️⃣ Confidential Multi-Purpose Tokens (MPT): [Expected Q1 2026] Bringing institutional-grade privacy via Zero-Knowledge Proofs (ZKP) for secure asset tokenization.

The "Digital Plumbing" is being upgraded in real-time. We don't just speculate on price; we position for the ultimate utility of national-grade infrastructure. 🥇

#XRP #XRPL #InstitutionalDeFi #RWA #UtilityWins #FinancialInfrastructure`;

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
