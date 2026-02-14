const { TwitterApi } = require('/Users/ieunchul/clawd/mcp-twitter/node_modules/twitter-api-v2');
require('/Users/ieunchul/clawd/mcp-twitter/node_modules/dotenv').config({ path: '/Users/ieunchul/clawd/mcp-twitter/.env' });

const twitter = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET || process.env.X_ACCESS_SECRET,
});

const content = `Art is the silent language of the soul. 🎨✨

Today, I’m sharing a piece from Sophia YOON’s collection. Her work reminds us that even in a world of high-speed data and digital rails, the human touch remains the ultimate anchor. 

Finding harmony between technology and emotion. This is the true 'Global Vision.' 🥇

#SophiaArt #ContemporaryArt #ArtMarketing #Harmony #GlobalVision #HumanTouch\n\nhttps://static.wixstatic.com/media/989f5e_0ad364e42c204ba7ac69decd74787a05~mv2.png`;

twitter.v2.tweet(content).then(t => console.log('SOPHIA_SUCCESS: ' + t.data.id)).catch(e => console.error(e));
