import { StatCell } from "@/components/common";
import { formatTime } from "@/lib/utils";

interface PathfindingStatsPanelProps {
  cellsExplored: number;
  pathLength: number;
  wallCount: number;
  timeElapsed: number;
  totalCells: number;
}

export function PathfindingStatsPanel({
  cellsExplored,
  pathLength,
  wallCount,
  timeElapsed,
  totalCells,
}: PathfindingStatsPanelProps) {
  return (
    <div className="grid grid-cols-4 font-space uppercase">
      <StatCell
        label="Cells Explored"
        value={cellsExplored}
        borderColor="border-b-algo-blue"
        textColor="text-algo-blue"
      />
      <StatCell
        label="Path Length"
        value={pathLength}
        borderColor="border-b-algo-yellow"
        textColor="text-algo-yellow"
      />
      <StatCell
        label="Walls"
        value={wallCount}
        borderColor="border-b-algo-red"
        textColor="text-algo-red"
        total={totalCells}
      />
      <StatCell
        label="Time"
        value={formatTime(timeElapsed)}
        borderColor="border-b-algo-purple"
        textColor="text-algo-purple"
      />
    </div>
  );
}
