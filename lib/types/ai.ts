export interface DataPoint {
  x: number;
  y: number;
  label?: number;       // class label (KNN, K-Means cluster)
  predicted?: number;   // predicted class/cluster
}

export interface RegressionStats {
  epoch: number;
  mse: number;
  rmse: number;
  rSquared: number;
  timeElapsed: number;
}

export interface RegressionSnapshot {
  points: DataPoint[];
  slope: number;
  intercept: number;
  stats: RegressionStats;
}

export interface KNNStats {
  pointsClassified: number;
  distancesCalculated: number;
  accuracy: number;
  timeElapsed: number;
}

export interface KNNSnapshot {
  points: DataPoint[];
  testPoint: DataPoint | null;
  neighbors: number[];       // indices of k-nearest neighbors
  k: number;
  stats: KNNStats;
}

export interface KMeansStats {
  iteration: number;
  inertia: number;
  clustersConverged: number;
  timeElapsed: number;
}

export interface KMeansSnapshot {
  points: DataPoint[];
  centroids: DataPoint[];
  assignments: number[];    // cluster index for each point
  k: number;
  stats: KMeansStats;
}

export type AISnapshot =
  | { type: "regression"; data: RegressionSnapshot }
  | { type: "knn"; data: KNNSnapshot }
  | { type: "k-means"; data: KMeansSnapshot };

export interface AIStats {
  primaryMetric: number;
  secondaryMetric: number;
  iterations: number;
  timeElapsed: number;
}

export interface AIContext {
  dataPoints: DataPoint[];
  pointCount: number;
  speed: number;
  stepIndex: number;
  snapshot: AISnapshot | null;
  stats: AIStats;
  // algorithm-specific params
  k: number;             // KNN:k / K-Means:k
  learningRate: number;  // regression
}

export type AIEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "generate" }
  | { type: "speedChange"; speed: number }
  | { type: "pointCountChange"; count: number }
  | { type: "kChange"; k: number }
  | { type: "learningRateChange"; rate: number }
  | { type: "setPoints"; points: DataPoint[] }
  | { type: "updateSnapshot"; snapshot: AISnapshot };

export type AIAlgorithmFn = (
  points: DataPoint[],
  params: { k?: number; learningRate?: number },
) => Generator<AISnapshot>;
