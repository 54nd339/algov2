import type { DataPoint } from "@/lib/types/ai";

/** Generate linearly distributed points with noise for regression */
export function generateRegressionData(count: number): DataPoint[] {
  const points: DataPoint[] = [];
  const slope = 1.5 + Math.random() * 2;
  const intercept = Math.random() * 20 - 10;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const noise = (Math.random() - 0.5) * 30;
    const y = Math.max(0, Math.min(100, slope * x + intercept + noise));
    points.push({ x, y });
  }
  return points;
}

/** Generate clustered data for KNN (classCount classes) */
export function generateClassificationData(count: number, classCount = 2): DataPoint[] {
  const points: DataPoint[] = [];
  const centers = Array.from({ length: classCount }, () => ({
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
  }));
  const perClass = Math.floor(count / classCount);
  for (let c = 0; c < classCount; c++) {
    const n = c === classCount - 1 ? count - perClass * (classCount - 1) : perClass;
    for (let i = 0; i < n; i++) {
      points.push({
        x: centers[c].x + (Math.random() - 0.5) * 30,
        y: centers[c].y + (Math.random() - 0.5) * 30,
        label: c,
      });
    }
  }
  return points;
}

/** Generate clustered data for K-Means (k clusters) */
export function generateClusterData(count: number, k: number): DataPoint[] {
  const points: DataPoint[] = [];
  const centers = Array.from({ length: k }, () => ({
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
  }));
  const perCluster = Math.floor(count / k);
  for (let c = 0; c < k; c++) {
    const n = c === k - 1 ? count - perCluster * (k - 1) : perCluster;
    for (let i = 0; i < n; i++) {
      points.push({
        x: centers[c].x + (Math.random() - 0.5) * 30,
        y: centers[c].y + (Math.random() - 0.5) * 30,
      });
    }
  }
  return points;
}
