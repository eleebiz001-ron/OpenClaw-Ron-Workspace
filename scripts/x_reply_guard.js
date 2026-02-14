#!/usr/bin/env node
'use strict';

const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
const { TwitterApi } = require('twitter-api-v2');

const HISTORY_PATH = '/Users/ieunchul/clawd/x_history.json';
const ENV_PATH = '/Users/ieunchul/clawd/mcp-twitter/.env';

function parseArgs(argv) {
  const args = argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filtered = args.filter((a) => a !== '--dry-run');
  if (filtered.length < 2) {
    console.error('Usage: node x_reply_guard.js <targetTweetId> <replyText> [--dry-run]');
    process.exit(1);
  }
  const targetTweetId = filtered[0];
  const replyText = filtered.slice(1).join(' ');
  return { targetTweetId, replyText, dryRun };
}

async function loadHistory() {
  try {
    const raw = await fs.readFile(HISTORY_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return { replied: {} };
    if (!data.replied || typeof data.replied !== 'object') data.replied = {};
    return data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { replied: {} };
    }
    throw err;
  }
}

async function saveHistory(data) {
  const dir = path.dirname(HISTORY_PATH);
  await fs.mkdir(dir, { recursive: true });
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(HISTORY_PATH, json);
}

async function main() {
  const { targetTweetId, replyText, dryRun } = parseArgs(process.argv);

  const history = await loadHistory();
  if (history.replied[targetTweetId]) {
    console.log('DUPLICATE');
    process.exit(2);
  }

  if (dryRun) {
    console.log('SUCCESS');
    return;
  }

  dotenv.config({ path: ENV_PATH });

  const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET
  });

  const res = await client.v2.reply(replyText, targetTweetId);
  const replyId = res && res.data && res.data.id ? res.data.id : null;
  if (!replyId) {
    throw new Error('Failed to obtain reply id from API response');
  }

  history.replied[targetTweetId] = {
    replyId,
    timestamp: new Date().toISOString()
  };
  await saveHistory(history);

  console.log(`SUCCESS ${replyId}`);
}

main().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
