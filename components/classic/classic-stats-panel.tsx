import { StatCell } from "@/components/common";
import { buildClassicStatCells } from "@/lib/algorithms/classic";
import { GRID_COLS } from "@/config";
import type { ClassicSnapshot } from "@/lib/types";

interface ClassicStatsPanelProps {
  snapshot: ClassicSnapshot | null;
}

export function ClassicStatsPanel({ snapshot }: ClassicStatsPanelProps) {
  const { cols, cells } = buildClassicStatCells(snapshot);

  return (
    <div className={`grid ${GRID_COLS[cols] ?? "grid-cols-3"} gap-px`}>
      {cells.map((c) => (
        <StatCell key={c.label} variant="compact" label={c.label} value={c.value} />
      ))}
    </div>
  );
}
