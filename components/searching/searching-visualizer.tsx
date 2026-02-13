"use client";

import type { AlgorithmSnapshot } from "@/lib/types/algorithms";

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

  return (
    <div className="flex h-full w-full items-end gap-px">
      {displayArray.map((value, index) => {
        const heightPct = (value / maxValue) * 100;
        const isTarget = searchTarget !== null && searchTarget !== undefined && value === searchTarget;

        let fill = "bg-bar-default";
        let border = "border-t-bar-default-border";

        if (found && visited[visited.length - 1] === index) {
          fill = "bg-bar-sorted";
          border = "border-t-bar-sorted-border";
        } else if (snapshot?.comparing?.includes(index)) {
          fill = "bg-bar-special";
          border = "border-t-bar-special-border";
        } else if (visited.includes(index)) {
          fill = "bg-bar-comparing";
          border = "border-t-bar-comparing-border";
        } else if (isTarget && !snapshot) {
          fill = "bg-algo-yellow/40";
          border = "border-t-algo-yellow";
        } else if (!snapshot) {
          fill = "bg-bar-default";
          border = "border-t-bar-default-border";
        }

        return (
          <div
            key={index}
            className={`relative flex-1 rounded-t-sm border-t-2 ${fill} ${border} ${onBarClick && !snapshot ? "cursor-pointer hover:opacity-80" : ""}`}
            style={{ height: `${heightPct}%`, minWidth: 2 }}
            onClick={onBarClick && !snapshot ? () => onBarClick(value) : undefined}
          >
            {isTarget && !snapshot && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-space text-[9px] font-bold text-algo-yellow">
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
