import type { AISnapshot, DataPoint } from "@/lib/types";

export const CLUSTER_COLORS = [
  "var(--algo-green)",
  "var(--algo-cyan)",
  "var(--algo-purple)",
  "var(--algo-yellow)",
  "var(--algo-red)",
  "var(--algo-blue)",
] as const;

export function getPoints(snapshot: AISnapshot): DataPoint[] {
  switch (snapshot.type) {
    case "regression":
    case "knn":
    case "k-means":
      return snapshot.data.points;
  }
}

/** Assigns a random KNN label when adding a point interactively. */
export function assignLabel(algoId: string, k: number): number | undefined {
  return algoId === "knn" ? Math.floor(Math.random() * k) : undefined;
}

export function getPointColor(p: DataPoint, snapshotType?: string): string {
  if (snapshotType === "k-means" && p.predicted !== undefined) {
    return CLUSTER_COLORS[p.predicted % CLUSTER_COLORS.length];
  }
  if (snapshotType === "knn" && p.label !== undefined) {
    return CLUSTER_COLORS[p.label % CLUSTER_COLORS.length];
  }
  return "var(--algo-green)";
}
