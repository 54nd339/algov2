import type { ClassicSnapshot } from "@/lib/types/classic";

interface ClassicStatsPanelProps {
  snapshot: ClassicSnapshot | null;
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 border border-border/30 bg-card/50 px-3 py-2">
      <span className="font-space text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-space text-lg font-bold text-algo-green">
        {value}
      </span>
    </div>
  );
}

export function ClassicStatsPanel({ snapshot }: ClassicStatsPanelProps) {
  if (!snapshot) {
    return (
      <div className="grid grid-cols-3 gap-px">
        <StatCell label="Moves" value={0} />
        <StatCell label="Total" value="—" />
        <StatCell label="Time" value={formatTime(0)} />
      </div>
    );
  }

  switch (snapshot.type) {
    case "tower-of-hanoi":
      return (
        <div className="grid grid-cols-3 gap-px">
          <StatCell
            label="Moves"
            value={`${snapshot.data.stats.movesMade}/${snapshot.data.stats.totalMoves}`}
          />
          <StatCell label="Total" value={snapshot.data.stats.totalMoves} />
          <StatCell label="Time" value={formatTime(snapshot.data.stats.timeElapsed)} />
        </div>
      );
  }
}
