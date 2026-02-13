"use client";

import type { AlgorithmSnapshot } from "@/lib/types/algorithms";

interface ArrayDisplayProps {
  array: number[];
  snapshot: AlgorithmSnapshot | null;
}

export function ArrayDisplay({ array, snapshot }: ArrayDisplayProps) {
  const displayArray = snapshot?.array ?? array;
  const comparing: number[] = snapshot?.comparing ? [...snapshot.comparing] : [];

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5 font-space text-sm">
      {displayArray.map((value, index) => {
        let color = "text-foreground/70";
        if (snapshot?.sorted?.includes(index)) {
          color = "text-algo-green";
        } else if (comparing.includes(index)) {
          color = "text-algo-red";
        }

        return (
          <span key={index} className={color}>
            {value}
          </span>
        );
      })}
    </div>
  );
}
