"use client";

import { useMemo } from "react";
import type { AISnapshot, DataPoint, KNNSnapshot } from "@/lib/types";
import { getPoints, getPointColor } from "@/lib/algorithms/ai";

interface RegressionLine {
  slope: number;
  intercept: number;
}

interface AIChartData {
  points: DataPoint[];
  centroids: DataPoint[];
  regressionLine: RegressionLine | null;
  knnHighlight: KNNSnapshot | null;
  snapshotType: string | undefined;
  getColor: (p: DataPoint) => string;
}

/** Extracts display-ready data from an AI snapshot, centralizing algorithm-specific branching. */
export function useAIChartData(snapshot: AISnapshot | null, dataPoints: DataPoint[]): AIChartData {
  const points = snapshot ? getPoints(snapshot) : dataPoints;
  const snapshotType = snapshot?.type;

  const centroids = useMemo(
    () => (snapshot?.type === "k-means" ? snapshot.data.centroids : []),
    [snapshot],
  );

  const regressionLine = useMemo<RegressionLine | null>(() => {
    if (!snapshot || snapshot.type !== "regression") return null;
    return { slope: snapshot.data.slope, intercept: snapshot.data.intercept };
  }, [snapshot]);

  const knnHighlight = useMemo<KNNSnapshot | null>(
    () => (snapshot?.type === "knn" ? snapshot.data : null),
    [snapshot],
  );

  const getColor = useMemo(
    () => (p: DataPoint) => getPointColor(p, snapshotType),
    [snapshotType],
  );

  return { points, centroids, regressionLine, knnHighlight, snapshotType, getColor };
}
