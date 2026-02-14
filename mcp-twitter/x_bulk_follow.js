const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

async function bulkFollow() {
  const myId = '2017763735809757187';
  // Grok이 선정한 고관여 투자자 및 인플루언서 리스트 (35명 이상 확보를 위한 리스트)
  const targets = [
    'crypto', 'cz_binance', 'VitalikButerin', 'saylor', 'jack',
    'cathiedwood', 'RaoulGMI', 'pomp', 'APompliano', 'ErikVoorhees',
    'SatoshiLite', 'barrysilbert', 'brian_armstrong', 'tyler', 'cameron',
    'novogratz', 'gavofyork', 'aantonop', 'IOHK_Charles', 'justinsuntron',
    'WhaleAlert', 'WatcherGuru', 'unusual_whales', 'glassnode', 'cryptoquant_com',
    'MessariCrypto', 'CoinTelegraph', 'CoinDesk', 'DecryptMedia', 'TheBlock__',
    'WuBlockchain', 'tier10k', 'ZhuSu', 'Arthur_Hayes', 'Cobie'
  ];

  console.log(`Starting bulk follow to reach target... Current target: ${targets.length} users`);

  for (const username of targets) {
    try {
      const target = await client.v2.userByUsername(username);
      if (target.data) {
        await client.v2.follow(myId, target.data.id);
        console.log(`Successfully followed: ${username}`);
      }
    } catch (e) {
      console.log(`Error following ${username}: `, e.message);
    }
    // 레이트 리밋 방지를 위한 3초 대기
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

bulkFollow();
