"use client";

import { useMemo } from "react";
import type { MinimaxNode, MinimaxSnapshot } from "@/lib/types";
import { layoutTree } from "@/lib/algorithms/games";
import { MINIMAX_TREE } from "@/config";
import { ScrollArea } from "@/components/ui";
import { EmptyVisualizerState } from "@/components/common";

const nodeColors: Record<MinimaxNode["status"], string> = {
  idle: "var(--muted-foreground)",
  active: "var(--algo-purple)",
  evaluated: "var(--algo-cyan)",
  pruned: "var(--algo-red)",
  selected: "var(--algo-green)",
};

interface MinimaxVisualizerProps {
  snapshot: MinimaxSnapshot | null;
}

export function MinimaxVisualizer({ snapshot }: MinimaxVisualizerProps) {
  const nodes = snapshot?.nodes ?? [];
  const root = useMemo(() => nodes.find((n) => n.id === "root") ?? null, [nodes]);
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const layout = useMemo(
    () => (root ? layoutTree(root, nodeMap) : null),
    [root, nodeMap],
  );

  if (!snapshot || !layout || !root) {
    return <EmptyVisualizerState />;
  }

  const positions = layout.positions;
  const width = Math.max(MINIMAX_TREE.height, layout.maxX + MINIMAX_TREE.yPadding);
  const maxY = layout.maxY + MINIMAX_TREE.yPadding;

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex items-center justify-center p-4">
        <svg viewBox={`0 0 ${width} ${maxY}`} className="max-h-full max-w-full" style={{ minWidth: MINIMAX_TREE.minWidth }}>
          {/* Edges */}
          {nodes.map((node) =>
            node.children.map((childId) => {
              const parentPos = positions.get(node.id);
              const childPos = positions.get(childId);
              if (!parentPos || !childPos) return null;
              const child = nodeMap.get(childId);
              const color = child?.status === "pruned" ? "var(--algo-red)" : "var(--muted-foreground)";
              return (
                <line
                  key={`${node.id}-${childId}`}
                  x1={parentPos.x}
                  y1={parentPos.y + 14}
                  x2={childPos.x}
                  y2={childPos.y - 14}
                  stroke={color}
                  strokeWidth={child?.status === "pruned" ? 1 : 1.5}
                  opacity={child?.status === "pruned" ? 0.3 : 0.5}
                />
              );
            }),
          )}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const color = nodeColors[node.status];
            return (
              <g key={node.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={14}
                  fill={`color-mix(in srgb, ${color} 20%, transparent)`}
                  stroke={color}
                  strokeWidth={node.status === "selected" ? 2.5 : 1.5}
                  opacity={node.status === "pruned" ? 0.3 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={color}
                  fontSize={10}
                  fontFamily="var(--font-space)"
                  fontWeight="bold"
                  opacity={node.status === "pruned" ? 0.3 : 1}
                >
                  {node.value !== null ? node.value : "?"}
                </text>
                {/* Max/Min indicator */}
                <text
                  x={pos.x}
                  y={pos.y - 18}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize={8}
                  fontFamily="var(--font-space)"
                  opacity={0.6}
                >
                  {node.isMax ? "MAX" : "MIN"}
                </text>
                {/* Alpha/Beta values */}
                {(node.alpha !== undefined || node.beta !== undefined) && node.status !== "idle" && (
                  <text
                    x={pos.x}
                    y={pos.y + 24}
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize={7}
                    fontFamily="var(--font-space)"
                    opacity={0.7}
                  >
                    α:{node.alpha === -Infinity ? "-∞" : node.alpha === Infinity ? "∞" : node.alpha ?? "?"}{" "}
                    β:{node.beta === -Infinity ? "-∞" : node.beta === Infinity ? "∞" : node.beta ?? "?"}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </ScrollArea>
  );
}
