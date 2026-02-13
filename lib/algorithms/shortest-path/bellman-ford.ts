import type {
  GraphNode,
  GraphEdge,
  GraphSnapshot,
  GraphStats,
  NodeStatus,
  EdgeStatus,
} from "@/lib/types/graph";

function makeStats(visited: number, relaxed: number, dist: number): GraphStats {
  return { nodesVisited: visited, edgesRelaxed: relaxed, totalDistance: dist, timeElapsed: 0 };
}

export function* bellmanFord(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceNode: number,
): Generator<GraphSnapshot> {
  const nodeStatuses: Record<number, NodeStatus> = {};
  const edgeStatuses: Record<string, EdgeStatus> = {};
  const distances: Record<number, number> = {};
  const prev: Record<number, number | null> = {};

  for (const n of nodes) {
    nodeStatuses[n.id] = n.id === sourceNode ? "source" : "idle";
    distances[n.id] = n.id === sourceNode ? 0 : Infinity;
    prev[n.id] = null;
  }
  for (const e of edges) edgeStatuses[e.id] = "idle";

  let relaxedCount = 0;
  const n = nodes.length;

  yield {
    nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
    distances: { ...distances }, currentNode: sourceNode, stats: makeStats(0, 0, 0),
  };

  // Relax all edges n-1 times
  for (let i = 0; i < n - 1; i++) {
    let updated = false;

    for (const edge of edges) {
      const { u, v, weight, id: eid } = edge;

      edgeStatuses[eid] = "active";
      relaxedCount++;

      // Try u → v
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        prev[v] = u;
        edgeStatuses[eid] = "relaxed";
        nodeStatuses[v] = "active";
        updated = true;

        yield {
          nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
          distances: { ...distances }, stats: makeStats(i + 1, relaxedCount, 0),
        };

        nodeStatuses[v] = v === sourceNode ? "source" : "visited";
      }

      // Try v → u (undirected)
      if (distances[v] !== Infinity && distances[v] + weight < distances[u]) {
        distances[u] = distances[v] + weight;
        prev[u] = v;
        edgeStatuses[eid] = "relaxed";
        nodeStatuses[u] = "active";
        updated = true;

        yield {
          nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
          distances: { ...distances }, stats: makeStats(i + 1, relaxedCount, 0),
        };

        nodeStatuses[u] = u === sourceNode ? "source" : "visited";
      }

      if (edgeStatuses[eid] === "active") edgeStatuses[eid] = "idle";
    }

    if (!updated) break; // Early termination
  }

  // Mark shortest path tree
  for (const nd of nodes) {
    if (nd.id !== sourceNode && prev[nd.id] !== null) {
      const p = prev[nd.id]!;
      const eid = p < nd.id ? `${p}-${nd.id}` : `${nd.id}-${p}`;
      if (edgeStatuses[eid] !== undefined) edgeStatuses[eid] = "inPath";
      nodeStatuses[nd.id] = "inPath";
    }
  }
  nodeStatuses[sourceNode] = "source";

  const totalDist = Object.values(distances).reduce(
    (s, d) => s + (d === Infinity ? 0 : d),
    0,
  );

  yield {
    nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
    distances: { ...distances }, stats: makeStats(n - 1, relaxedCount, totalDist),
  };
}
