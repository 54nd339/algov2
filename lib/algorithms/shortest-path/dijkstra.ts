import type {
  GraphNode,
  GraphEdge,
  GraphSnapshot,
  GraphStats,
  NodeStatus,
  EdgeStatus,
} from "@/lib/types/graph";
import { buildAdjacencyList } from "./graph-utils";

function makeStats(visited: number, relaxed: number, dist: number): GraphStats {
  return { nodesVisited: visited, edgesRelaxed: relaxed, totalDistance: dist, timeElapsed: 0 };
}

export function* dijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceNode: number,
): Generator<GraphSnapshot> {
  const adj = buildAdjacencyList(nodes, edges);
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

  const visited = new Set<number>();
  const unvisited = new Set(nodes.map((n) => n.id));
  let relaxedCount = 0;

  yield {
    nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
    distances: { ...distances }, currentNode: sourceNode, stats: makeStats(0, 0, 0),
  };

  while (unvisited.size > 0) {
    // Find closest unvisited
    let u = -1;
    let minDist = Infinity;
    for (const id of unvisited) {
      if (distances[id] < minDist) {
        minDist = distances[id];
        u = id;
      }
    }
    if (u === -1 || distances[u] === Infinity) break;

    unvisited.delete(u);
    visited.add(u);
    if (u !== sourceNode) nodeStatuses[u] = "visited";

    // Relax neighbors
    for (const { to: v, weight, edgeId } of adj.get(u) ?? []) {
      if (visited.has(v)) continue;
      const newDist = distances[u] + weight;

      nodeStatuses[v] = "active";
      edgeStatuses[edgeId] = "active";
      relaxedCount++;

      yield {
        nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
        distances: { ...distances }, currentNode: u,
        stats: makeStats(visited.size, relaxedCount, 0),
      };

      if (newDist < distances[v]) {
        distances[v] = newDist;
        prev[v] = u;
        edgeStatuses[edgeId] = "relaxed";
      } else {
        edgeStatuses[edgeId] = "idle";
      }

      if (!visited.has(v)) nodeStatuses[v] = "idle";
    }

    nodeStatuses[u] = u === sourceNode ? "source" : "visited";

    yield {
      nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
      distances: { ...distances }, currentNode: u,
      stats: makeStats(visited.size, relaxedCount, 0),
    };
  }

  // Build shortest path tree — highlight edges used
  for (const n of nodes) {
    if (n.id !== sourceNode && prev[n.id] !== null) {
      const p = prev[n.id]!;
      const eid = p < n.id ? `${p}-${n.id}` : `${n.id}-${p}`;
      if (edgeStatuses[eid] !== undefined) edgeStatuses[eid] = "inPath";
      nodeStatuses[n.id] = "inPath";
    }
  }
  nodeStatuses[sourceNode] = "source";

  const totalDist = Object.values(distances).reduce(
    (s, d) => s + (d === Infinity ? 0 : d),
    0,
  );

  yield {
    nodes, edges, nodeStatuses: { ...nodeStatuses }, edgeStatuses: { ...edgeStatuses },
    distances: { ...distances }, stats: makeStats(visited.size, relaxedCount, totalDist),
  };
}
