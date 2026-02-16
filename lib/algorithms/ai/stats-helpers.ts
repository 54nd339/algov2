import { formatTime } from "@/lib/utils";
import type { AISnapshot, RegressionSnapshot, KNNSnapshot, KMeansSnapshot, PerceptronSnapshot } from "@/lib/types";

export interface AIStatCellData {
  label: string;
  value: string | number;
  borderColor: string;
  textColor: string;
  total?: number;
}

/** Build the stat cells array for the AI stats panel based on snapshot type. */
export function buildAIStatCells(
  snapshot: AISnapshot | null,
  totalPoints: number,
  algoId: string,
  learningRate?: number,
  k?: number,
): AIStatCellData[] {
  if (!snapshot) {
    return [
      { label: "Iterations", value: "—", borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
      { label: "Metric", value: "—", borderColor: "border-b-algo-green", textColor: "text-algo-green" },
      { label: "Points", value: totalPoints, borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
      { label: "Time", value: "—", borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
    ];
  }

  switch (snapshot.type) {
    case "regression":
      return buildRegressionCells(snapshot.data, totalPoints, learningRate);
    case "knn":
      return buildKNNCells(snapshot.data, totalPoints, k ?? snapshot.data.k);
    case "k-means":
      return buildKMeansCells(snapshot.data, totalPoints, k ?? snapshot.data.k);
  }
}

function buildRegressionCells(
  data: RegressionSnapshot,
  totalPoints: number,
  learningRate?: number,
): AIStatCellData[] {
  const { slope, intercept, stats } = data;
  const sign = intercept >= 0 ? "+" : "−";
  const equation = `y = ${slope.toFixed(2)}x ${sign} ${Math.abs(intercept).toFixed(2)}`;
  return [
    { label: "Epoch", value: stats.epoch, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan", total: 200 },
    { label: "R²", value: stats.rSquared, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
    { label: "RMSE", value: stats.rmse, borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
    { label: "Time", value: formatTime(stats.timeElapsed), borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
    { label: "Model", value: equation, borderColor: "border-b-algo-red", textColor: "text-algo-red" },
    { label: "Learn Rate", value: learningRate ?? "—", borderColor: "border-b-algo-blue", textColor: "text-algo-blue" },
    { label: "MSE", value: stats.mse, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
    { label: "Points", value: totalPoints, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
  ];
}

/** Tally counts per class/cluster and format as "C0:5 C1:3 ...". */
function formatBreakdown(counts: Record<number, number>): string {
  return Object.entries(counts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([id, count]) => `C${id}:${count}`)
    .join(" ") || "—";
}

function buildKNNCells(
  data: KNNSnapshot,
  totalPoints: number,
  k: number,
): AIStatCellData[] {
  const { stats, points } = data;
  const classCounts: Record<number, number> = {};
  for (const p of points) {
    if (p.predicted === undefined) continue;
    classCounts[p.predicted] = (classCounts[p.predicted] ?? 0) + 1;
  }
  return [
    { label: "Classified", value: stats.pointsClassified, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan", total: totalPoints },
    { label: "Accuracy", value: `${stats.accuracy}%`, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
    { label: "Groups", value: Math.max(Object.keys(classCounts).length, k), borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
    { label: "Time", value: formatTime(stats.timeElapsed), borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
    { label: "Breakdown", value: formatBreakdown(classCounts), borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
    { label: "Distances", value: stats.distancesCalculated, borderColor: "border-b-algo-blue", textColor: "text-algo-blue" },
    { label: "Points", value: totalPoints, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
  ];
}

function buildKMeansCells(
  data: KMeansSnapshot,
  totalPoints: number,
  k: number,
): AIStatCellData[] {
  const { stats, assignments, k: snapK } = data;
  const clusterCounts: Record<number, number> = {};
  for (const a of assignments) {
    clusterCounts[a] = (clusterCounts[a] ?? 0) + 1;
  }
  const assigned = assignments.filter((a) => a >= 0).length;
  return [
    { label: "Iteration", value: stats.iteration, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
    { label: "Inertia", value: stats.inertia, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
    { label: "K", value: k ?? snapK, borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
    { label: "Time", value: formatTime(stats.timeElapsed), borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
    { label: "Assigned", value: assigned, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan", total: totalPoints },
    { label: "Converged", value: stats.clustersConverged, borderColor: "border-b-algo-green", textColor: "text-algo-green", total: snapK },
    { label: "Clusters", value: formatBreakdown(clusterCounts), borderColor: "border-b-algo-blue", textColor: "text-algo-blue" },
    { label: "Points", value: totalPoints, borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
  ];
}

/* ── Perceptron (standalone — not part of buildAIStatCells switch) ──── */

export function buildPerceptronCells(
  snapshot: PerceptronSnapshot | null,
  layers: number,
  activation: string,
): AIStatCellData[] {
  if (!snapshot) {
    return [
      { label: "Epoch", value: "—", borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
      { label: "Loss", value: "—", borderColor: "border-b-algo-red", textColor: "text-algo-red" },
      { label: "Accuracy", value: "—", borderColor: "border-b-algo-green", textColor: "text-algo-green" },
      { label: "Time", value: "—", borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
    ];
  }

  const { stats, currentInput, currentOutput } = snapshot;
  return [
    { label: "Epoch", value: stats.epoch, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan", total: stats.totalEpochs },
    { label: "Loss", value: stats.loss, borderColor: "border-b-algo-red", textColor: "text-algo-red" },
    { label: "Accuracy", value: `${stats.accuracy}%`, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
    { label: "Time", value: formatTime(stats.timeElapsed), borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
    { label: "Activation", value: activation, borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
    { label: "Layers", value: layers, borderColor: "border-b-algo-blue", textColor: "text-algo-blue" },
    { label: "Input", value: `[${currentInput.join(", ")}]`, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
    { label: "Output", value: currentOutput, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
  ];
}
