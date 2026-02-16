export interface AlgorithmStats {
  comparisons: number;
  swaps: number;
  accesses: number;
  timeElapsed: number;
}

export interface AlgorithmSnapshot {
  array: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  special?: number;
  sorted?: number[];
  visited?: number[];
  found?: boolean;
  stats: AlgorithmStats;
}

export interface SearchingSnapshot extends AlgorithmSnapshot {
  searchIndex?: number;
  found: boolean;
}

export interface AlgoContext {
  array: number[];
  speed: number;
  stepIndex: number;
  snapshot: AlgorithmSnapshot | null;
  stats: AlgorithmStats;
  progress: number;
}

export type AlgoEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "speedChange"; speed: number }
  | { type: "sizeChange"; size: number }
  | { type: "generate" }
  | { type: "updateSnapshot"; snapshot: AlgorithmSnapshot };

export interface AlgorithmMetadata {
  id: string;
  name: string;
  description: string;
  sourceCode: string;
  complexity: {
    time: {
      best: string;
      average: string;
      worst: string;
    };
    space: string;
  };
  stable: boolean;
  inPlace: boolean;
}
