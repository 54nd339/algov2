export interface GraphNode {
  id: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  u: number;
  v: number;
  weight: number;
}

export type NodeStatus = "idle" | "active" | "visited" | "source" | "inPath";
export type EdgeStatus = "idle" | "active" | "relaxed" | "inPath";

export interface GraphStats {
  nodesVisited: number;
  edgesRelaxed: number;
  totalDistance: number;
  timeElapsed: number;
}

export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeStatuses: Record<number, NodeStatus>;
  edgeStatuses: Record<string, EdgeStatus>;
  distances: Record<number, number>;
  allDistances?: Record<number, Record<number, number>>;
  currentNode?: number;
  shortestPath?: number[];
  stats: GraphStats;
}

export interface GraphContext {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCount: number;
  sourceNode: number | null;
  speed: number;
  stepIndex: number;
  snapshot: GraphSnapshot | null;
  stats: GraphStats;
}

export type GraphEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "generate" }
  | { type: "speedChange"; speed: number }
  | { type: "nodeCountChange"; count: number }
  | { type: "setSource"; nodeId: number }
  | { type: "updateSnapshot"; snapshot: GraphSnapshot };

export type GraphAlgorithmFn = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceNode: number,
) => Generator<GraphSnapshot>;
