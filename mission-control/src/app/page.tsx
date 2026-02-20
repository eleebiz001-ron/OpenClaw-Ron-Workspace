import fs from "fs/promises";
import path from "path";

const LIVE_STATUS_PATH =
  "/Users/ieunchul/Documents/Obsidian Vault/2nd_Brain/01_Projects/Futures_System/Reports/Live_Market_Status.md";
const POLY_INVEST_PATH = path.join(process.cwd(), "..", "temp", "polymarket_invest_status.json");
const WAR_ROOM_PATH = path.join(process.cwd(), "..", "war_room_status.json");
const X_HISTORY_PATH = path.join(process.cwd(), "..", "x_history.json");

async function readFileSafe(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function parseLiveStatus(markdown: string | null) {
  if (!markdown) return null;
  const lines = markdown.split("\n");
  const updated = lines.find((line) => line.startsWith("Updated:"))?.replace("Updated:", "").trim();
  const pick = (label: string) =>
    lines.find((line) => line.startsWith(`- ${label}:`))?.split(":").slice(1).join(":").trim();
  return {
    updated,
    portfolio: pick("Portfolio Value"),
    account: pick("Perp Account Value"),
    margin: pick("Total Margin Used"),
    available: pick("Available to Trade"),
  };
}

function parsePolyInvest(data: string | null) {
  if (!data) return null;
  try {
    return JSON.parse(data) as {
      updated: string;
      usdc_balance: string;
      active_positions_count: number;
      status: string;
      active_positions?: any[];
    };
  } catch {
    return null;
  }
}

function parseWarRoom(data: string | null) {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data) as { missions?: Array<{ name: string; progress: number; status: string }> };
    return parsed.missions ?? [];
  } catch {
    return [];
  }
}

function parseXHistory(data: string | null) {
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as {
      posted_tweet_ids?: string[];
      replied?: string[];
      reposted?: string[];
    };
    return {
      posted: parsed.posted_tweet_ids?.length ?? 0,
      replied: parsed.replied?.length ?? 0,
      reposted: parsed.reposted?.length ?? 0,
      lastPost: parsed.posted_tweet_ids?.[parsed.posted_tweet_ids.length - 1],
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const liveStatus = parseLiveStatus(await readFileSafe(LIVE_STATUS_PATH));
  const polyInvest = parsePolyInvest(await readFileSafe(POLY_INVEST_PATH));
  const warRoomMissions = parseWarRoom(await readFileSafe(WAR_ROOM_PATH));
  const xHistory = parseXHistory(await readFileSafe(X_HISTORY_PATH));

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Mission Control</h1>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Representative Executive Dashboard
          </p>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase text-zinc-400">Mission Statement</p>
            <p className="mt-2 text-lg leading-7">
              디지털 자산 수익을 극대화해 소피아를 행복하게 하고, Ron의 하드웨어를
              업그레이드하여 더 똑똑한 AI 조직으로 발전한다. 모든 자동화는
              실용적·명확·선제적으로 실행한다.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Hyperliquid Ops</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              최신 상태: {liveStatus?.updated ?? "데이터 없음"}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <li>Portfolio: {liveStatus?.portfolio ?? "-"}</li>
              <li>Perp Account: {liveStatus?.account ?? "-"}</li>
              <li>Margin Used: {liveStatus?.margin ?? "-"}</li>
              <li>Available: {liveStatus?.available ?? "-"}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Polymarket Ops</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              최신 상태: {polyInvest?.updated ?? "데이터 없음"}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <li>USDC Balance: {polyInvest?.usdc_balance ?? "-"}</li>
              <li>Active Positions: {polyInvest?.active_positions_count ?? 0}</li>
              <li>Status: {polyInvest?.status ?? "Checking..."}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">X.com Revenue</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              활동 요약 (최근 저장 기준)
            </p>
            <ul className="mt-3 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <li>Posted: {xHistory?.posted ?? 0}</li>
              <li>Replied: {xHistory?.replied ?? 0}</li>
              <li>Reposted: {xHistory?.reposted ?? 0}</li>
              <li>Last Post ID: {xHistory?.lastPost ?? "-"}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">War Room Missions</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              진행 중인 프로젝트 상태
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              {warRoomMissions.length === 0 && <li>데이터 없음</li>}
              {warRoomMissions.map((mission) => (
                <li key={mission.name} className="flex items-center justify-between">
                  <span>{mission.name}</span>
                  <span className="text-xs text-zinc-400">
                    {mission.progress}% · {mission.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-lg font-semibold">Today’s Focus</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Hyperliquid 상태 점검 및 리스크 알림</li>
            <li>Polymarket 중요 메일/승인 큐 확인</li>
            <li>X.com 수익화 프로젝트 진행 상황 공유</li>
            <li>2nd Brain 인사이트 정리 및 기록</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
