import { StatCell } from "@/components/common";
import { buildPerceptronCells } from "@/lib/algorithms/ai";
import type { PerceptronSnapshot } from "@/lib/types";

interface PerceptronStatsPanelProps {
  snapshot: PerceptronSnapshot | null;
  layers: number;
  activation: string;
}

export function PerceptronStatsPanel({ snapshot, layers, activation }: PerceptronStatsPanelProps) {
  const cells = buildPerceptronCells(snapshot, layers, activation);

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
