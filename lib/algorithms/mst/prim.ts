import type {
  GraphNode,
  GraphEdge,
  MSTSnapshot,
  MSTNodeStatus,
  MSTEdgeStatus,
  MSTStats,
} from "@/lib/types/mst";
import {
  buildAdjacencyList,
  edgeId,
} from "@/lib/algorithms/shortest-path/graph-utils";

/* ── Prim's MST Algorithm ───────────────────────────────────────────── */
// Greedy: grow MST from node 0 by always adding the lightest crossing edge.
// Uses a simple O(V²) scan — fine for small visualizer graphs.

export function* prim(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceNode?: number,
): Generator<MSTSnapshot> {
  const adj = buildAdjacencyList(nodes, edges);
  const inMST = new Set<number>();
  const mstEdges: string[] = [];
  const nodeStatuses: Record<number, MSTNodeStatus> = {};
  const edgeStatuses: Record<string, MSTEdgeStatus> = {};
  let totalWeight = 0;
  let edgesChecked = 0;
  const startTime = performance.now();

  const snap = (): MSTSnapshot => ({
    nodes,
    edges,
    mstEdges: [...mstEdges],
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    totalWeight,
    stats: makeStats(),
  });

  const makeStats = (): MSTStats => ({
    edgesInMST: mstEdges.length,
    totalWeight,
    edgesChecked,
    timeElapsed: Math.round(performance.now() - startTime),
  });

  // Start from source node (or node 0)
  const start = sourceNode ?? nodes[0].id;
  inMST.add(start);
  nodeStatuses[start] = "source";
  yield snap();

  while (inMST.size < nodes.length) {
    let bestEdge: { u: number; v: number; weight: number; eid: string } | null =
      null;

    // Scan all edges from MST frontier
    for (const u of inMST) {
      for (const neighbor of adj.get(u) ?? []) {
        if (inMST.has(neighbor.to)) continue;
        edgesChecked++;
        const eid = edgeId(u, neighbor.to);
        edgeStatuses[eid] = "considered";

        if (!bestEdge || neighbor.weight < bestEdge.weight) {
          // Reject previous best
          if (bestEdge) edgeStatuses[bestEdge.eid] = "rejected";
          bestEdge = { u, v: neighbor.to, weight: neighbor.weight, eid };
          edgeStatuses[eid] = "active";
        } else {
          edgeStatuses[eid] = "rejected";
        }
      }
    }

    yield snap();

    if (!bestEdge) break; // disconnected graph

    // Add best edge to MST
    inMST.add(bestEdge.v);
    mstEdges.push(bestEdge.eid);
    totalWeight += bestEdge.weight;
    edgeStatuses[bestEdge.eid] = "inMST";
    nodeStatuses[bestEdge.v] = "inMST";
    nodeStatuses[bestEdge.u] = "inMST";

    // Clear non-MST edge statuses for next iteration
    for (const e of edges) {
      if (edgeStatuses[e.id] !== "inMST") {
        edgeStatuses[e.id] = "idle";
      }
    }

    yield snap();
  }

  // Final — mark source
  nodeStatuses[start] = "source";
  yield snap();
}
