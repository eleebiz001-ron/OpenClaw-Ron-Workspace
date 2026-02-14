const { OpenAI } = require('openai');
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.X_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

async function generateSummary() {
  const news = [
    "Bitcoin drops 15%, briefly breaking below $61,000 as sell-off intensifies.",
    "Over $2.7B liquidated in the last 24 hours across the crypto market.",
    "92 out of the top 100 cryptocurrencies are in the red, showing broad market decline.",
    "XRP hits $1.43 after a 10.6% drop, leading the decline among top 10 coins.",
    "Analysts suggest the market has entered 'full capitulation mode' as it breaks key moving averages."
  ];

  const prompt = "Create a 'Top 5 Crypto News Summary' for X.com based on these headlines: " + news.join(' ') + ". " +
  "The tone should be professional, objective, yet slightly optimistic for long-term holders. " +
  "Include relevant hashtags like #CryptoNews #Bitcoin #MarketUpdate. " +
  "Keep it concise for X.";

  try {
    const completion = await client.chat.completions.create({
      model: "grok-beta",
      messages: [{ role: "user", content: prompt }],
    });
    process.stdout.write(completion.choices[0].message.content);
  } catch (e) {
    console.error('Grok failed:', e.message);
  }
}

generateSummary();
