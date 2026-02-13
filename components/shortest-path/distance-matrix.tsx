"use client";

import type { GraphNode } from "@/lib/types/graph";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DistanceMatrixProps {
  allDistances: Record<number, Record<number, number>>;
  nodes: GraphNode[];
}

export function DistanceMatrix({ allDistances, nodes }: DistanceMatrixProps) {
  const sortedIds = [...nodes].sort((a, b) => a.id - b.id).map((n) => n.id);

  return (
    <div className="border border-border bg-card">
      <div className="px-3 py-2">
        <p className="font-space text-xs font-bold uppercase tracking-wider text-muted-foreground">
          All-Pairs Distance Matrix
        </p>
      </div>
      <ScrollArea className="max-h-64 w-full">
        <table className="w-full border-collapse font-space text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 border border-border bg-muted px-2 py-1 text-center text-muted-foreground">
                —
              </th>
              {sortedIds.map((id) => (
                <th
                  key={id}
                  className="sticky top-0 z-10 border border-border bg-muted px-2 py-1 text-center text-algo-cyan"
                >
                  {id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedIds.map((from) => (
              <tr key={from}>
                <td className="sticky left-0 z-10 border border-border bg-muted px-2 py-1 text-center font-bold text-algo-cyan">
                  {from}
                </td>
                {sortedIds.map((to) => {
                  const dist = allDistances[from]?.[to];
                  const isSelf = from === to;
                  const isInf = dist === Infinity || dist === undefined;
                  return (
                    <td
                      key={to}
                      className={`border border-border px-2 py-1 text-center ${
                        isSelf
                          ? "bg-algo-green/10 text-algo-green"
                          : isInf
                            ? "text-muted-foreground/50"
                            : "text-foreground"
                      }`}
                    >
                      {isSelf ? "0" : isInf ? "∞" : dist}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
