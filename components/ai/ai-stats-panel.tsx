import { StatCell } from "@/components/common";
import { buildAIStatCells } from "@/lib/algorithms/ai";
import type { AISnapshot } from "@/lib/types";

interface AIStatsPanelProps {
  snapshot: AISnapshot | null;
  totalPoints: number;
  algoId: string;
  learningRate?: number;
  k?: number;
}

export function AIStatsPanel({ snapshot, totalPoints, algoId, learningRate, k }: AIStatsPanelProps) {
  const cells = buildAIStatCells(snapshot, totalPoints, algoId, learningRate, k);

  return (
    <div className="space-y-0">
      <div className="grid grid-cols-4 font-space uppercase">
        {cells.slice(0, 4).map((cell) => (
          <StatCell key={cell.label} {...cell} />
        ))}
      </div>
      {cells.length > 4 && (
        <div className="grid grid-cols-4 font-space uppercase">
          {cells.slice(4).map((cell) => (
            <StatCell key={cell.label} {...cell} />
          ))}
        </div>
      )}
    </div>
  );
}
