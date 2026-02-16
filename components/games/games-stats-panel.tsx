import { StatCell } from "@/components/common";
import { buildGamesStatCells } from "@/lib/algorithms/games";
import { GRID_COLS } from "@/config";
import type { GamesSnapshot } from "@/lib/types";

interface GamesStatsPanelProps {
  snapshot: GamesSnapshot | null;
}

export function GamesStatsPanel({ snapshot }: GamesStatsPanelProps) {
  const { cols, cells } = buildGamesStatCells(snapshot);

  return (
    <div className={`grid ${GRID_COLS[cols] ?? "grid-cols-4"} gap-px`}>
      {cells.map((c) => (
        <StatCell key={c.label} variant="compact" label={c.label} value={c.value} />
      ))}
    </div>
  );
}
