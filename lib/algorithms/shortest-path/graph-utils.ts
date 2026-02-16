import type { GraphNode, GraphEdge, GraphStats } from "@/lib/types";

/* ── Graph generation ───────────────────────────────────────────────── */

/** Create nodes in a grid arrangement and connect them with k-nearest edges */
export function generateRandomGraph(
  count: number,
  width = 800,
  height = 500,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const padding = 60;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const rows = Math.min(2, count);
  const cols = Math.ceil(count / rows);
  const cellWidth = usableWidth / cols;
  const cellHeight = usableHeight / rows;

  for (let i = 0; i < count; i++) {
    const row = i % rows;
    const col = Math.floor(i / rows);
    nodes.push({
      id: i,
      x: padding + col * cellWidth + cellWidth / 2,
      y: padding + row * cellHeight + cellHeight / 2,
    });
  }

  const k = Math.min(3, count - 1);
  const edgeSet = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const node of nodes) {
    const neighbors = nodes
      .filter((n) => n.id !== node.id)
      .map((n) => ({
        id: n.id,
        dist: Math.hypot(n.x - node.x, n.y - node.y),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, k);

    for (const nb of neighbors) {
      const key =
        node.id < nb.id ? `${node.id}-${nb.id}` : `${nb.id}-${node.id}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({
          id: key,
          u: Math.min(node.id, nb.id),
          v: Math.max(node.id, nb.id),
          weight: Math.round(nb.dist / 10),
        });
      }
    }
  }

  return { nodes, edges };
}

/* ── Adjacency list ─────────────────────────────────────────────────── */

type AdjEntry = { to: number; weight: number; edgeId: string };

export function buildAdjacencyList(
  nodes: GraphNode[],
  edges: GraphEdge[],
): Map<number, AdjEntry[]> {
  const adj = new Map<number, AdjEntry[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    adj.get(e.u)!.push({ to: e.v, weight: e.weight, edgeId: e.id });
    adj.get(e.v)!.push({ to: e.u, weight: e.weight, edgeId: e.id });
  }
  return adj;
}

/* ── Edge ID helper ─────────────────────────────────────────────────── */

export function edgeId(u: number, v: number): string {
  return u < v ? `${u}-${v}` : `${v}-${u}`;
}

/* ── Shared stat builder ───────────────────────────────────────────── */

/** All three shortest-path algorithms emit the same stat shape; centralised here to stay DRY. */
export function makeGraphStats(visited: number, relaxed: number, dist: number): GraphStats {
  return { nodesVisited: visited, edgesRelaxed: relaxed, totalDistance: dist, timeElapsed: 0 };
}
