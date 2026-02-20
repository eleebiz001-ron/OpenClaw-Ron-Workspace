import fs from "fs/promises";
import path from "path";

const WAR_ROOM_PATH = path.join(process.cwd(), "..", "war_room_status.json");

async function getWarRoomData() {
  try {
    const data = await fs.readFile(WAR_ROOM_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export default async function WarRoomPage() {
  const data = await getWarRoomData();

  if (!data) {
    return (
      <div className="p-10 text-center">
        <p>War Room 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const agents = Object.entries(data.agents || {});

  return (
    <main className="mx-auto w-full max-w-5xl flex flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">War Room</h1>
        <p className="text-sm text-zinc-500 uppercase tracking-widest">Live Agent Operations</p>
      </header>

      {/* Agents Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(([id, agent]: [string, any]) => (
          <div key={id} className={`rounded-2xl border p-5 shadow-sm bg-white dark:bg-zinc-950 transition-all ${agent.status === 'ACTIVE' ? 'border-emerald-500/50' : 'border-zinc-200 dark:border-zinc-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{agent.avatar || '🤖'}</span>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${agent.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-zinc-100 text-zinc-500'}`}>
                {agent.status}
              </span>
            </div>
            <h3 className="font-bold text-lg capitalize">{id}</h3>
            <p className="text-xs text-zinc-400 mt-1">{agent.model}</p>
            <div className="mt-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] uppercase font-bold text-zinc-400">Current Task</p>
              <p className="text-sm mt-1 line-clamp-2">{agent.task}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Live Logs */}
      <section className="rounded-2xl border border-zinc-200 bg-zinc-900 p-6 shadow-xl dark:border-zinc-800 overflow-hidden flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs text-zinc-500 font-mono ml-2">agent_stream.log</span>
        </div>
        <div className="flex flex-col gap-3 font-mono text-xs text-zinc-300 max-h-[400px] overflow-y-auto">
          {data.logs?.slice(-10).map((log: any, idx: number) => (
            <div key={idx} className="flex gap-4 border-l border-zinc-700/50 pl-4">
              <span className="text-zinc-600 shrink-0">{log.time}</span>
              <span className="leading-relaxed whitespace-pre-wrap">{log.msg}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
