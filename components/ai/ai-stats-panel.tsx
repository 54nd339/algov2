import type { AISnapshot } from "@/lib/types/ai";

interface AIStatsPanelProps {
  snapshot: AISnapshot | null;
  totalPoints: number;
  algoId: string;
  learningRate?: number;
  k?: number;
}

export function AIStatsPanel({ snapshot, totalPoints, algoId, learningRate, k }: AIStatsPanelProps) {
  const cells = getStatCells(snapshot, totalPoints, algoId, learningRate, k);

  return (
    <div className="space-y-0">
      <div className="grid grid-cols-4 font-space uppercase">
        {cells.slice(0, 4).map((cell, i) => (
          <div
            key={i}
            className={`border-b-[8px] ${cell.borderColor} border-r border-r-border bg-card px-3 py-3 last:border-r-0`}
          >
            <p className="text-[10px] tracking-wider text-muted-foreground">
              {cell.label}
            </p>
            <p className={`text-2xl font-bold ${cell.textColor}`}>
              {cell.value}
            </p>
            {cell.total !== undefined && (
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                / {cell.total}
              </p>
            )}
          </div>
        ))}
      </div>
      {cells.length > 4 && (
        <div className="grid grid-cols-4 font-space uppercase">
          {cells.slice(4).map((cell, i) => (
            <div
              key={i}
              className={`border-b-[8px] ${cell.borderColor} border-r border-r-border bg-card px-3 py-3 last:border-r-0`}
            >
              <p className="text-[10px] tracking-wider text-muted-foreground">
                {cell.label}
              </p>
              <p className={`text-2xl font-bold ${cell.textColor}`}>
                {cell.value}
              </p>
              {cell.total !== undefined && (
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  / {cell.total}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface StatCell {
  label: string;
  value: string | number;
  borderColor: string;
  textColor: string;
  total?: number;
}

function getStatCells(snapshot: AISnapshot | null, totalPoints: number, algoId: string, learningRate?: number, k?: number): StatCell[] {
  if (!snapshot) {
    return [
      { label: "Iterations", value: "—", borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
      { label: "Metric", value: "—", borderColor: "border-b-algo-green", textColor: "text-algo-green" },
      { label: "Points", value: totalPoints, borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
      { label: "Time", value: "—", borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
    ];
  }

  switch (snapshot.type) {
    case "regression": {
      const { slope, intercept, stats } = snapshot.data;
      const sign = intercept >= 0 ? "+" : "−";
      const equation = `y = ${slope.toFixed(2)}x ${sign} ${Math.abs(intercept).toFixed(2)}`;
      return [
        { label: "Epoch", value: stats.epoch, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan", total: 200 },
        { label: "R²", value: stats.rSquared, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
        { label: "RMSE", value: stats.rmse, borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
        { label: "Time", value: `${stats.timeElapsed}ms`, borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
        { label: "Model", value: equation, borderColor: "border-b-algo-red", textColor: "text-algo-red" },
        { label: "Learn Rate", value: learningRate ?? "—", borderColor: "border-b-algo-blue", textColor: "text-algo-blue" },
        { label: "MSE", value: stats.mse, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
        { label: "Points", value: totalPoints, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
      ];
    }
    case "knn": {
      const { stats, points } = snapshot.data;
      const classCounts: Record<number, number> = {};
      for (const p of points) {
        if (p.predicted === undefined) continue;
        classCounts[p.predicted] = (classCounts[p.predicted] ?? 0) + 1;
      }
      const groups = Object.keys(classCounts).length;
      const breakdownStr = Object.entries(classCounts)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([label, count]) => `C${label}:${count}`)
        .join(" ");
      return [
        { label: "Classified", value: stats.pointsClassified, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan", total: totalPoints },
        { label: "Accuracy", value: `${stats.accuracy}%`, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
        { label: "Groups", value: Math.max(groups, k ?? snapshot.data.k), borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
        { label: "Time", value: `${stats.timeElapsed}ms`, borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
        { label: "Breakdown", value: breakdownStr || "—", borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
        { label: "Distances", value: stats.distancesCalculated, borderColor: "border-b-algo-blue", textColor: "text-algo-blue" },
        { label: "Points", value: totalPoints, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
      ];
    }
    case "k-means": {
      const { stats, assignments, k: snapK } = snapshot.data;
      const clusterCounts: Record<number, number> = {};
      for (const a of assignments) {
        clusterCounts[a] = (clusterCounts[a] ?? 0) + 1;
      }
      const assigned = assignments.filter((a) => a >= 0).length;
      const breakdownStr = Object.entries(clusterCounts)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([cluster, count]) => `C${cluster}:${count}`)
        .join(" ");
      return [
        { label: "Iteration", value: stats.iteration, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan" },
        { label: "Inertia", value: stats.inertia, borderColor: "border-b-algo-green", textColor: "text-algo-green" },
        { label: "K", value: k ?? snapK, borderColor: "border-b-algo-yellow", textColor: "text-algo-yellow" },
        { label: "Time", value: `${stats.timeElapsed}ms`, borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
        { label: "Assigned", value: assigned, borderColor: "border-b-algo-cyan", textColor: "text-algo-cyan", total: totalPoints },
        { label: "Converged", value: stats.clustersConverged, borderColor: "border-b-algo-green", textColor: "text-algo-green", total: snapK },
        { label: "Clusters", value: breakdownStr || "—", borderColor: "border-b-algo-blue", textColor: "text-algo-blue" },
        { label: "Points", value: totalPoints, borderColor: "border-b-algo-purple", textColor: "text-algo-purple" },
      ];
    }
  }
}
