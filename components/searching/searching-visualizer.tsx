"use client";

import { useCallback } from "react";
import type { AlgorithmSnapshot } from "@/lib/types";
import { barHeightPct, barColors } from "@/lib/utils";
import { MIN_BAR_WIDTH } from "@/config";

interface SearchingVisualizerProps {
  array: number[];
  snapshot: AlgorithmSnapshot | null;
  searchTarget?: number | null;
  onBarClick?: (value: number) => void;
}

export function SearchingVisualizer({ array, snapshot, searchTarget, onBarClick }: SearchingVisualizerProps) {
  const displayArray = snapshot?.array ?? array;
  const maxValue = Math.max(1, ...displayArray);
  const visited = snapshot?.visited ?? [];
  const found = snapshot?.found ?? false;
  const canClick = !!onBarClick && !snapshot;

  // Event-delegated click handler avoids per-bar closures
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onBarClick || snapshot) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-value]");
      if (!el) return;
      onBarClick(Number(el.dataset.value));
    },
    [onBarClick, snapshot],
  );

  return (
    <div className="flex h-full w-full items-end gap-px" onClick={canClick ? handleClick : undefined}>
      {displayArray.map((value, index) => {
        const heightPct = barHeightPct(value, maxValue);
        const isTarget = searchTarget !== null && searchTarget !== undefined && value === searchTarget;

        /* Searching uses 'special' for active comparison and 'comparing' for visited history */
        const status = (found && visited[visited.length - 1] === index)
          ? "sorted" as const
          : snapshot?.comparing?.includes(index)
            ? "special" as const
            : visited.includes(index)
              ? "comparing" as const
              : "default" as const;

        let { fill, border } = barColors(status);
        if (isTarget && !snapshot) {
          fill = "bg-algo-yellow/40";
          border = "border-t-algo-yellow";
        }

        return (
          <div
            key={index}
            data-value={value}
            className={`relative flex-1 rounded-t-sm border-t-2 ${fill} ${border} ${canClick ? "cursor-pointer hover:opacity-80" : ""}`}
            style={{ height: `${heightPct}%`, minWidth: MIN_BAR_WIDTH }}
          >
            {isTarget && !snapshot && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-space text-3xs font-bold text-algo-yellow">
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
