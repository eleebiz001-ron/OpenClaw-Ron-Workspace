const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
require('dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const postContent = `Reports from the recent White House meeting reveal a deepening divide between the banking and crypto sectors. As @EleanorTerrett and @CoinDesk have noted, the atmosphere was thick with tension—traditional banks are "digging in their heels," particularly over the debate on stablecoin yields. The concern of "deposit flight" is real for legacy institutions, while firms like Ripple and Circle argue for market-driven innovation (via @CCN).

However, looking at this from a strategic leadership perspective, this isn’t just a clash of industries—it’s a test of America’s global financial roadmap.

A stalemate only breeds uncertainty, which as we’ve seen, the markets despise. We cannot let a "deadlock" delay the CLARITY Act until 2027. We need a unified rulebook now.

In high-stakes competition, the goal is to establish a secure, fair, and fast track that everyone can run on. Whether it’s #XRP, #RLUSD, or institutional tokenization, the US must prioritize National-grade Infrastructure over sectoral protectionism.

It’s time for a pragmatic compromise. Let’s pass the CLARITY Act and secure the global financial rails for the next century. 🇺🇸🥇

#CLARITYAct #Ripple #XRP #CryptoRegulation #WhiteHouse #GlobalVision`;

async function post() {
  try {
    const tweet = await twitter.v2.tweet(postContent);
    console.log(`SUCCESS: Strategic post live! ID: ${tweet.data.id}`);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

post();
