
const { TwitterApi } = require('./mcp-twitter/node_modules/twitter-api-v2');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, 'mcp-twitter', '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8').split('\n');
    envConfig.forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

// "589 Elite" list usernames (High-signal targets)
const targets = [
    'bgarlinghouse', 
    'Ripple', 
    'HBAR_Foundation', 
    'StellarOrg', 
    'saylor', 
    'elonmusk', 
    'Trump', 
    'Scaramucci', 
    'RaoulGMI'
];

async function runStrategicReposting() {
    console.log("Starting Ron's Strategic Reposting...");
    
    let processedCount = 0;
    const maxReposts = 3;

    for (const targetUser of targets) {
        if (processedCount >= maxReposts) break;

        try {
            console.log(`Checking @${targetUser}...`);
            const user = await client.v2.userByUsername(targetUser);
            if (!user.data) continue;

            const tweets = await client.v2.userTimeline(user.data.id, { 
                max_results: 10, 
                "tweet.fields": "id,text,public_metrics,created_at",
                exclude: 'replies'
            });

            if (tweets.data && tweets.data.data && tweets.data.data.length > 0) {
                // Filter for high engagement or high signal
                // For this script, we'll pick the top performing one from the last 10
                const sortedTweets = tweets.data.data.sort((a, b) => {
                    const scoreA = (a.public_metrics.retweet_count * 2) + a.public_metrics.like_count;
                    const scoreB = (b.public_metrics.retweet_count * 2) + b.public_metrics.like_count;
                    return scoreB - scoreA;
                });

                const topTweet = sortedTweets[0];
                const tweetId = topTweet.id;

                // Check if already reposted (optional, for now we just try)
                // In a production system, we'd check a local database
                
                console.log(`Selected Tweet ID ${tweetId} from @${targetUser}: "${topTweet.text.substring(0, 50)}..."`);
                
                // Repost (Retweet)
                // Note: v2.retweet requires the authenticating user's ID
                const me = await client.v2.me();
                await client.v2.retweet(me.data.id, tweetId);
                console.log(`Successfully reposted ${tweetId}`);

                processedCount++;
                // Small delay between actions
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error(`Error processing @${targetUser}:`, error.message);
        }
    }
    
    console.log(`Finished. Total reposted: ${processedCount}`);
}

runStrategicReposting();
