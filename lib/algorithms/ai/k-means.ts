import type { DataPoint, AISnapshot, KMeansStats } from "@/lib/types/ai";

/* ── K-Means Clustering ─────────────────────────────────────────── */

export function* kMeans(
  points: DataPoint[],
  params: { k?: number },
): Generator<AISnapshot> {
  const k = params.k ?? 3;
  const startTime = performance.now();
  const maxIterations = 50;

  // Initialize centroids randomly from data points
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  const centroids: DataPoint[] = shuffled.slice(0, k).map((p, i) => ({
    x: p.x,
    y: p.y,
    label: i,
  }));
  let assignments = new Array<number>(points.length).fill(0);
  let iteration = 0;

  const calcInertia = (): number => {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      const c = centroids[assignments[i]];
      sum += (points[i].x - c.x) ** 2 + (points[i].y - c.y) ** 2;
    }
    return Math.round(sum * 100) / 100;
  };

  const snap = (convergedCount: number): AISnapshot => {
    const stats: KMeansStats = {
      iteration,
      inertia: calcInertia(),
      clustersConverged: convergedCount,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "k-means",
      data: {
        points: points.map((p, i) => ({ ...p, predicted: assignments[i] })),
        centroids: centroids.map((c) => ({ ...c })),
        assignments: [...assignments],
        k,
        stats,
      },
    };
  };

  yield snap(0);

  for (iteration = 1; iteration <= maxIterations; iteration++) {
    // Assign each point to nearest centroid
    const newAssignments = points.map((p) => {
      let bestDist = Infinity;
      let bestCluster = 0;
      for (let c = 0; c < k; c++) {
        const d = Math.hypot(p.x - centroids[c].x, p.y - centroids[c].y);
        if (d < bestDist) {
          bestDist = d;
          bestCluster = c;
        }
      }
      return bestCluster;
    });
    assignments = newAssignments;

    yield snap(0);

    // Recalculate centroids
    let convergedCount = 0;
    for (let c = 0; c < k; c++) {
      const members = points.filter((_, i) => assignments[i] === c);
      if (members.length === 0) continue;
      const newX = members.reduce((s, p) => s + p.x, 0) / members.length;
      const newY = members.reduce((s, p) => s + p.y, 0) / members.length;
      const dx = Math.abs(centroids[c].x - newX);
      const dy = Math.abs(centroids[c].y - newY);
      if (dx < 0.01 && dy < 0.01) convergedCount++;
      centroids[c] = { x: newX, y: newY, label: c };
    }

    yield snap(convergedCount);

    // Converged
    if (convergedCount === k) break;
  }

  yield snap(k);
}
