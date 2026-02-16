import type { MinimaxNode } from "@/lib/types";

interface Position {
  x: number;
  y: number;
}

interface TreeLayout {
  positions: Map<string, Position>;
  maxX: number;
  maxY: number;
}

/**
 * Computes a top-down tree layout for a minimax game tree.
 * Leaf nodes are placed left-to-right; internal nodes center
 * above their children. Gap sizes adapt to total node count
 * so large trees still fit without overflow.
 */
export function layoutTree(
  root: MinimaxNode,
  nodeMap: Map<string, MinimaxNode>,
): TreeLayout {
  const positions = new Map<string, Position>();
  const nodeCount = nodeMap.size;

  // Tighter spacing for larger trees to prevent overflow
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
