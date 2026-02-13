"use client";

import type { MinimaxNode, MinimaxSnapshot } from "@/lib/types/games";

/* ── Node colors ───────────────────────────────────────────────── */

const nodeColors: Record<MinimaxNode["status"], string> = {
  idle: "var(--muted-foreground)",
  active: "var(--algo-purple)",
  evaluated: "var(--algo-cyan)",
  pruned: "var(--algo-red)",
  selected: "var(--algo-green)",
};

/* ── Main component ────────────────────────────────────────────── */

interface MinimaxVisualizerProps {
  snapshot: MinimaxSnapshot | null;
}

export function MinimaxVisualizer({ snapshot }: MinimaxVisualizerProps) {
  if (!snapshot) {
    return (
      <div className="flex h-full w-full items-center justify-center font-space text-muted-foreground">
        Press Play to start
      </div>
    );
  }

  const { nodes } = snapshot;
  const root = nodes.find((n) => n.id === "root");
  if (!root) return null;

  // Build a tree layout
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const layout = layoutTree(root, nodeMap);
  const positions = layout.positions;
  const width = Math.max(420, layout.maxX + 40);
  const maxY = layout.maxY + 40;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
      <svg viewBox={`0 0 ${width} ${maxY}`} className="max-h-full max-w-full" style={{ minWidth: 400 }}>
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
  );
}

/* ── Tree layout ───────────────────────────────────────────────── */

function layoutTree(root: MinimaxNode, nodeMap: Map<string, MinimaxNode>) {
  const positions = new Map<string, { x: number; y: number }>();
  const nodeCount = nodeMap.size;
  const nodeGap = nodeCount > 80 ? 24 : nodeCount > 60 ? 28 : nodeCount > 40 ? 34 : 40;
  const depthGap = nodeCount > 80 ? 46 : nodeCount > 60 ? 52 : 64;
  let nextX = 0;
  let maxDepth = 0;

  const place = (node: MinimaxNode, depth: number): number => {
    maxDepth = Math.max(maxDepth, depth);
    if (node.children.length === 0) {
      const x = nextX * nodeGap + 20;
      const y = 30 + depth * depthGap;
      positions.set(node.id, { x, y });
      nextX += 1;
      return x;
    }

    const childXs: number[] = [];
    for (const childId of node.children) {
      const child = nodeMap.get(childId);
      if (!child) continue;
      childXs.push(place(child, depth + 1));
    }

    const x = childXs.length
      ? childXs.reduce((sum, cx) => sum + cx, 0) / childXs.length
      : nextX * nodeGap + 20;
    const y = 30 + depth * depthGap;
    positions.set(node.id, { x, y });
    return x;
  };

  place(root, 0);

  const maxX = Math.max(...Array.from(positions.values()).map((p) => p.x), 0);
  const maxY = 30 + maxDepth * depthGap;
  return { positions, maxX, maxY };
}
