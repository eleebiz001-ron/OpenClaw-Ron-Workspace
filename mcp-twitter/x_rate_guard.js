/**
 * README: Utility to run async tasks or shell commands with a delay to help avoid rate limits.
 */

'use strict';

const { exec } = require('node:child_process');
const { promisify } = require('node:util');

const execAsync = promisify(exec);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithDelay(tasks, delayMs) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('tasks must be an array of async functions');
  }
  const delay = Number(delayMs) || 0;
  for (let i = 0; i < tasks.length; i += 1) {
    const task = tasks[i];
    if (typeof task !== 'function') {
      throw new TypeError(`tasks[${i}] is not a function`);
    }
    await task();
    if (i < tasks.length - 1 && delay > 0) {
      await sleep(delay);
    }
  }
}

async function runShellCommand(command) {
  const { stdout, stderr } = await execAsync(command, { shell: true });
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
}

function parseArgs(argv) {
  const args = [...argv];
  let delayMs = 0;
  let loop = false;
  const commandParts = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--delay') {
      const value = args[i + 1];
      if (!value) throw new Error('Missing value for --delay');
      delayMs = Number(value);
      if (!Number.isFinite(delayMs) || delayMs < 0) {
        throw new Error('Invalid --delay value');
      }
      i += 1;
      continue;
    }
    if (arg === '--loop') {
      loop = true;
      continue;
    }
    commandParts.push(arg);
  }

  return { delayMs, loop, command: commandParts.join(' ') };
}

async function main() {
  const { delayMs, loop, command } = parseArgs(process.argv.slice(2));

  if (!command) {
    console.error('Usage: node x_rate_guard.js --delay 300000 [--loop] command...');
    process.exit(1);
  }

  const runner = async () => {
    await runShellCommand(command);
  };

  if (loop) {
    while (true) {
      await runner();
      if (delayMs > 0) await sleep(delayMs);
    }
  } else {
    await runWithDelay([runner], delayMs);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err && err.stack ? err.stack : String(err));
    process.exit(1);
  });
}

module.exports = { runWithDelay };
