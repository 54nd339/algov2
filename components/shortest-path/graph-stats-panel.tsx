import { StatCell } from "@/components/common";
import { formatTime } from "@/lib/utils";

interface GraphStatsPanelProps {
  nodesVisited: number;
  edgesRelaxed: number;
  totalDistance: number;
  timeElapsed: number;
  totalNodes: number;
}

export function GraphStatsPanel({
  nodesVisited,
  edgesRelaxed,
  totalDistance,
  timeElapsed,
  totalNodes,
}: GraphStatsPanelProps) {
  return (
    <div className="grid grid-cols-4 font-space uppercase">
      <StatCell
        label="Nodes Visited"
        value={nodesVisited}
        borderColor="border-b-algo-cyan"
        textColor="text-algo-cyan"
        total={totalNodes}
      />
      <StatCell
        label="Edges Relaxed"
        value={edgesRelaxed}
        borderColor="border-b-algo-green"
        textColor="text-algo-green"
      />
      <StatCell
        label="Total Distance"
        value={totalDistance === 0 ? "—" : totalDistance}
        borderColor="border-b-algo-yellow"
        textColor="text-algo-yellow"
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
