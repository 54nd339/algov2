import type { AlgorithmSnapshot } from "@/lib/types";
import { barHeightPct, barColors } from "@/lib/utils";
import { MIN_BAR_WIDTH } from "@/config";

interface SortingVisualizerProps {
  array: number[];
  snapshot: AlgorithmSnapshot | null;
}

export function SortingVisualizer({ array, snapshot }: SortingVisualizerProps) {
  const displayArray = snapshot?.array ?? array;
  const maxValue = Math.max(1, ...displayArray);

  return (
    <div className="flex h-full w-full items-end gap-px">
      {displayArray.map((value, index) => {
        const heightPct = barHeightPct(value, maxValue);

        const status = snapshot?.sorted?.includes(index)
          ? "sorted" as const
          : snapshot?.swapping?.includes(index)
            ? "swapping" as const
            : snapshot?.comparing?.includes(index)
              ? "comparing" as const
              : snapshot?.special === index
                ? "special" as const
                : "default" as const;
        const { fill, border } = barColors(status);

        return (
          <div
            key={index}
            className={`flex-1 rounded-t-sm border-t-2 ${fill} ${border}`}
            style={{ height: `${heightPct}%`, minWidth: MIN_BAR_WIDTH }}
          />
        );
      })}
    </div>
  );
}
