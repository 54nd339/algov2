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

export function* floydWarshall(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceNode: number,
): Generator<GraphSnapshot> {
  const ids = nodes.map((n) => n.id);
  const nodeStatuses: Record<number, NodeStatus> = {};
  const edgeStatuses: Record<string, EdgeStatus> = {};

  for (const n of nodes) nodeStatuses[n.id] = n.id === sourceNode ? "source" : "idle";
  for (const e of edges) edgeStatuses[e.id] = "idle";

  // Initialize distance matrix
  const dist: Record<number, Record<number, number>> = {};
  for (const i of ids) {
    dist[i] = {};
    for (const j of ids) {
      dist[i][j] = i === j ? 0 : Infinity;
    }
  }
  for (const e of edges) {
    dist[e.u][e.v] = Math.min(dist[e.u][e.v], e.weight);
    dist[e.v][e.u] = Math.min(dist[e.v][e.u], e.weight);
  }

  let relaxedCount = 0;

  yield {
    nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
    distances: { ...dist[sourceNode] },
    allDistances: JSON.parse(JSON.stringify(dist)),
    currentNode: sourceNode,
    stats: makeStats(0, 0, 0),
  };

  // Floyd-Warshall main triple loop
  for (const k of ids) {
    nodeStatuses[k] = k === sourceNode ? "source" : "active";

    for (const i of ids) {
      for (const j of ids) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          relaxedCount++;
        }
      }
    }

    yield {
      nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
      distances: { ...dist[sourceNode] },
      allDistances: JSON.parse(JSON.stringify(dist)),
      currentNode: k,
      stats: makeStats(ids.indexOf(k) + 1, relaxedCount, 0),
    };

    nodeStatuses[k] = k === sourceNode ? "source" : "visited";
  }

  // Final: mark edges in shortest path tree from source
  for (const n of nodes) {
    if (n.id === sourceNode) continue;
    if (dist[sourceNode][n.id] === Infinity) continue;

    // Find edge on the shortest path to this node
    for (const e of edges) {
      const eu = e.u, ev = e.v;
      if (
        (dist[sourceNode][eu] + e.weight === dist[sourceNode][ev] && ev === n.id) ||
        (dist[sourceNode][ev] + e.weight === dist[sourceNode][eu] && eu === n.id)
      ) {
        edgeStatuses[e.id] = "inPath";
        nodeStatuses[n.id] = "inPath";
        break;
      }
    }
  }
  nodeStatuses[sourceNode] = "source";

  const totalDist = Object.values(dist[sourceNode]).reduce(
    (s, d) => s + (d === Infinity ? 0 : d),
    0,
  );

  yield {
    nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
    distances: { ...dist[sourceNode] },
    allDistances: JSON.parse(JSON.stringify(dist)),
    stats: makeStats(ids.length, relaxedCount, totalDist),
  };
}
