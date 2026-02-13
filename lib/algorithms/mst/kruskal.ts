import type {
  GraphNode,
  GraphEdge,
  MSTSnapshot,
  MSTNodeStatus,
  MSTEdgeStatus,
  MSTStats,
} from "@/lib/types/mst";

/* ── Kruskal's MST Algorithm ────────────────────────────────────────── */
// Sort all edges by weight, greedily add if it doesn't form a cycle.
// Uses Union-Find with path compression + union by rank.

class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb;
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;
    else {
      this.parent[rb] = ra;
      this.rank[ra]++;
    }
    return true;
  }
}

export function* kruskal(
  nodes: GraphNode[],
  edges: GraphEdge[],
  _sourceNode?: number,
): Generator<MSTSnapshot> {
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(nodes.length);
  // Map node IDs → sequential indices for UnionFind
  const idMap = new Map(nodes.map((n, i) => [n.id, i]));

  const mstEdges: string[] = [];
  const nodeStatuses: Record<number, MSTNodeStatus> = {};
  const edgeStatuses: Record<string, MSTEdgeStatus> = {};
  let totalWeight = 0;
  let edgesChecked = 0;
  const startTime = performance.now();

  const makeStats = (): MSTStats => ({
    edgesInMST: mstEdges.length,
    totalWeight,
    edgesChecked,
    timeElapsed: Math.round(performance.now() - startTime),
  });

  const snap = (): MSTSnapshot => ({
    nodes,
    edges,
    mstEdges: [...mstEdges],
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    totalWeight,
    stats: makeStats(),
  });

  yield snap();

  for (const edge of sorted) {
    edgesChecked++;
    edgeStatuses[edge.id] = "active";
    nodeStatuses[edge.u] = nodeStatuses[edge.u] === "inMST" ? "inMST" : "active";
    nodeStatuses[edge.v] = nodeStatuses[edge.v] === "inMST" ? "inMST" : "active";
    yield snap();

    const idxU = idMap.get(edge.u)!;
    const idxV = idMap.get(edge.v)!;

    if (uf.union(idxU, idxV)) {
      // Edge accepted — no cycle
      mstEdges.push(edge.id);
      totalWeight += edge.weight;
      edgeStatuses[edge.id] = "inMST";
      nodeStatuses[edge.u] = "inMST";
      nodeStatuses[edge.v] = "inMST";
    } else {
      // Edge rejected — would form cycle
      edgeStatuses[edge.id] = "rejected";
      if (nodeStatuses[edge.u] !== "inMST") nodeStatuses[edge.u] = "idle";
      if (nodeStatuses[edge.v] !== "inMST") nodeStatuses[edge.v] = "idle";
    }

    yield snap();

    // MST complete when we have V-1 edges
    if (mstEdges.length === nodes.length - 1) break;
  }

  yield snap();
}
