import { StatCell } from "./stat-cell";
import { formatTime } from "@/lib/utils";

interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  accesses: number;
  timeElapsed: number;
  total: number;
}

export function StatsPanel({
  comparisons,
  swaps,
  accesses,
  timeElapsed,
  total,
}: StatsPanelProps) {
  return (
    <div className="grid grid-cols-4 font-space uppercase">
      <StatCell
        label="Comparisons"
        value={comparisons}
        borderColor="border-b-algo-cyan"
        textColor="text-algo-cyan"
      />
      <StatCell
        label="Swaps"
        value={swaps}
        borderColor="border-b-algo-green"
        textColor="text-algo-green"
      />
      <StatCell
        label="Array Accesses"
        value={accesses}
        borderColor="border-b-algo-yellow"
        textColor="text-algo-yellow"
      />
      <StatCell
        label="Time"
        value={formatTime(timeElapsed)}
        borderColor="border-b-algo-purple"
        textColor="text-algo-purple"
        total={total}
      />
    </div>
  );
}
