import fs from "fs/promises";
import path from "path";

const HL_POSITIONS_PATH = path.join(process.cwd(), "..", "temp", "hyperliquid_positions.json");
const POLY_INVEST_PATH = path.join(process.cwd(), "..", "temp", "polymarket_invest_status.json");

async function readFileSafe(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function parseJSON(data: string | null) {
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export default async function PositionsPage() {
  const hlData = parseJSON(await readFileSafe(HL_POSITIONS_PATH)) || { positions: [], count: 0 };
  const polyData = parseJSON(await readFileSafe(POLY_INVEST_PATH)) || { active_positions: [], active_positions_count: 0 };

  return (
    <main className="mx-auto w-full max-w-5xl flex flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Positions</h1>
        <p className="text-sm text-zinc-500 uppercase tracking-widest">Hyperliquid & Polymarket</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {/* Hyperliquid Positions */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Hyperliquid Positions</h2>
          <p className="mt-2 text-sm text-zinc-500">Active: {hlData.count ?? 0}</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            {(hlData.positions || []).length === 0 && <p>활성 포지션 없음</p>}
            {(hlData.positions || []).map((pos: any, idx: number) => (
              <div key={`${pos.coin}-${idx}`} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="font-medium">{pos.coin} ({pos.posSide})</p>
                <p>Size: {pos.size}</p>
                <p>Entry: {pos.entryPx ?? "-"}</p>
                <p>uPnL: {pos.unrealizedPnl ?? "-"}</p>
                <p>Leverage: {typeof pos.leverage === 'object' ? `${pos.leverage.type} ${pos.leverage.value}x` : (pos.leverage ?? "-")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Polymarket Positions */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Polymarket Positions</h2>
          <p className="mt-2 text-sm text-zinc-500">Active: {polyData.active_positions_count ?? 0}</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            {(polyData.active_positions || []).length === 0 && <p>활성 포지션 없음</p>}
            {(polyData.active_positions || []).map((pos: any, idx: number) => (
              <div key={`${pos.title}-${idx}`} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="font-medium">{pos.title}</p>
                <p>Outcome: {pos.outcome}</p>
                <p>Size: {pos.size}</p>
                <p>Value: ${pos.current_value?.toFixed?.(2) ?? pos.current_value}</p>
                <p>PnL: {pos.pnl_percent?.toFixed?.(2) ?? pos.pnl_percent}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
