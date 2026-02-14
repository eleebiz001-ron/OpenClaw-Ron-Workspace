#!/usr/bin/env node

const API_KEY = process.env.BRAVE_API_KEY;

if (!API_KEY) {
  console.error('Missing BRAVE_API_KEY in environment.');
  process.exit(1);
}

const QUERY = 'top global financial news economy Fed interest rates CPI markets';

function formatDate(d) {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function safeText(value, fallback = 'N/A') {
  if (!value || typeof value !== 'string') return fallback;
  return value.replace(/\s+/g, ' ').trim();
}

async function fetchNews() {
  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', QUERY);
  url.searchParams.set('count', '15'); // Fetch slightly more to filter
  url.searchParams.set('freshness', 'pd');
  url.searchParams.set('country', 'US');
  url.searchParams.set('search_lang', 'en');

  const res = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': API_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brave API error: ${res.status} ${text}`);
  }

  return res.json();
}

function buildOutput(results) {
  const dateStr = formatDate(new Date());
  let output = `🤵‍♂️ Strategic Daily Top 10 | ${dateStr} 🥇\n\n`;
  output += `[News & Trends]\n`;

  // Filter out results without snippets or likely non-news
  const filtered = results.filter(item => item.description || item.snippet).slice(0, 10);

  if (filtered.length === 0) {
    output += '1. No results returned: Brave search delivered an empty set. ⚖️\n';
    output += 'Source: N/A\n\n';
  } else {
    filtered.forEach((item, index) => {
      const title = safeText(item.title || item.name);
      const description = safeText(item.description || item.snippet || 'No description available.');
      const link = safeText(item.url || 'N/A');

      output += `${index + 1}. ${title}: ${description} ⚖️\n`;
      output += `Source: ${link}\n\n`;
    });
  }

  output += `[Sophia Art Spotlight] 🎨✨\n`;
  output += `In a world of macro turbulence, art remains the ultimate anchor. Today, I share a piece from Sophia YOON’s collection—where layers of green evoke inner peace and growth.\n\n`;
  output += `Explore her world:\n`;
  output += `👉 https://www.sopym.com/artgallery\n\n`;
  output += `#CLARITYAct #Bitcoin #XRP #SophiaArt #GlobalVision #MadeInUSA #FinancialRails`;

  return output.trimEnd();
}

async function run() {
  try {
    const data = await fetchNews();
    const results = data?.web?.results || [];
    const text = buildOutput(results);
    process.stdout.write(text + '\n');
  } catch (err) {
    console.error('FAILED:', err.message || err);
    process.exit(1);
  }
}

run();
