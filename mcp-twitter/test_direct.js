const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: 'u3WjzoL5lr7kEDkD21zGNawjg',
  appSecret: 'bXUAM9qPN0Mcer6oHrtUIviXhRYnisIDbpxQksU3lxM0sZrfOL',
  accessToken: '2017763735809757187-0vs1F8C0H58vpWP0nwqN8d3erafhwM',
  accessSecret: 'X45bl20Jn5zvrMAIl1mejRmnVq5h2GDXYbK5UubOghQuU',
});

async function verifyMe() {
  try {
    console.log('Testing hardcoded keys...');
    const me = await client.v2.me();
    console.log('SUCCESS!');
    console.log('My ID:', me.data.id);
    console.log('My Name:', me.data.name);
    console.log('My Username:', me.data.username);
  } catch (e) {
    console.log('Error Type:', e.constructor.name);
    console.log('Error Message:', e.message);
    if (e.data) console.log('Error Data:', JSON.stringify(e.data, null, 2));
  }
}
verifyMe();
