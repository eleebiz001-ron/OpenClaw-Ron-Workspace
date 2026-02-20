import fs from "fs/promises";
import path from "path";

const ALGO_PATH = path.join(process.cwd(), "..", "ALGO.md");

async function getAlgoData() {
  try {
    return await fs.readFile(ALGO_PATH, "utf8");
  } catch {
    return "# Strategy Data Not Found\nPlease ensure ALGO.md exists in the root directory.";
  }
}

export default async function StrategyPage() {
  const algoContent = await getAlgoData();

  return (
    <main className="mx-auto w-full max-w-5xl flex flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Trading Strategy</h1>
        <p className="text-sm text-zinc-500 uppercase tracking-widest">Ron's Core Algorithms & Principles</p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {/* Simple markdown-to-text display for now */}
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {algoContent}
          </pre>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 dark:border-blue-900/30 dark:bg-blue-950/10">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Hyperliquid Focus</h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Unified Account Margin Management</li>
            <li>• Cash & Carry via Funding Rates</li>
            <li>• 11 Master Techniques Implementation</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-6 dark:border-amber-900/30 dark:bg-amber-950/10">
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">Polymarket [Iron Claw]</h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Grok-Powered Realtime News Analysis</li>
            <li>• Macro Policy Filter (2nd Brain)</li>
            <li>• Precision Sizing & High Conviction Only</li>
          </ul>
        </div>
      </section>

      <footer className="text-center text-xs text-zinc-400">
        This page serves as Ron's permanent memory anchor for all trading operations.
      </footer>
    </main>
  );
}
