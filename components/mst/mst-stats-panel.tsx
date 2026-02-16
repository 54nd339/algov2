import { StatCell } from "@/components/common";
import { formatTime } from "@/lib/utils";

interface MSTStatsPanelProps {
  edgesInMST: number;
  totalWeight: number;
  edgesChecked: number;
  timeElapsed: number;
  totalNodes: number;
}

export function MSTStatsPanel({
  edgesInMST,
  totalWeight,
  edgesChecked,
  timeElapsed,
  totalNodes,
}: MSTStatsPanelProps) {
  return (
    <div className="grid grid-cols-4 font-space uppercase">
      <StatCell
        label="MST Edges"
        value={edgesInMST}
        borderColor="border-b-algo-green"
        textColor="text-algo-green"
        total={totalNodes - 1}
      />
      <StatCell
        label="Total Weight"
        value={totalWeight === 0 ? "—" : totalWeight}
        borderColor="border-b-algo-yellow"
        textColor="text-algo-yellow"
      />
      <StatCell
        label="Edges Checked"
        value={edgesChecked}
        borderColor="border-b-algo-cyan"
        textColor="text-algo-cyan"
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
