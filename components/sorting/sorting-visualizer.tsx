"use client";

import type { AlgorithmSnapshot } from "@/lib/types/algorithms";

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
        const heightPct = (value / maxValue) * 100;

        let fill = "bg-bar-default";
        let border = "border-t-bar-default-border";

        if (snapshot?.sorted?.includes(index)) {
          fill = "bg-bar-sorted";
          border = "border-t-bar-sorted-border";
        } else if (snapshot?.comparing?.includes(index)) {
          fill = "bg-bar-comparing";
          border = "border-t-bar-comparing-border";
        } else if (snapshot) {
          fill = "bg-bar-default";
          border = "border-t-bar-default-border";
        }

        return (
          <div
            key={index}
            className={`flex-1 rounded-t-sm border-t-2 ${fill} ${border}`}
            style={{ height: `${heightPct}%`, minWidth: 2 }}
          />
        );
      })}
    </div>
  );
}
