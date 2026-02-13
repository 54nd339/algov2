import type { GraphNode, GraphEdge } from "./graph";

export type { GraphNode, GraphEdge } from "./graph";

export type MSTNodeStatus = "idle" | "active" | "inMST" | "source";
export type MSTEdgeStatus = "idle" | "active" | "inMST" | "considered" | "rejected";

export interface MSTStats {
  edgesInMST: number;
  totalWeight: number;
  edgesChecked: number;
  timeElapsed: number;
}

export interface MSTSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  mstEdges: string[];
  nodeStatuses: Record<number, MSTNodeStatus>;
  edgeStatuses: Record<string, MSTEdgeStatus>;
  totalWeight: number;
  stats: MSTStats;
}

export interface MSTContext {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCount: number;
  sourceNode: number;
  speed: number;
  stepIndex: number;
  snapshot: MSTSnapshot | null;
  stats: MSTStats;
}

export type MSTEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "generate" }
  | { type: "speedChange"; speed: number }
  | { type: "nodeCountChange"; count: number }
  | { type: "setSource"; nodeId: number }
  | { type: "updateSnapshot"; snapshot: MSTSnapshot };

export type MSTAlgorithmFn = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceNode?: number,
) => Generator<MSTSnapshot>;
