import type { DataPoint, AISnapshot, KNNStats } from "@/lib/types/ai";

/* ── K-Nearest Neighbors ────────────────────────────────────────── */
// Splits labeled data into train/test, classifies test points using
// majority vote of k nearest training neighbors.

export function* knn(
  points: DataPoint[],
  params: { k?: number },
): Generator<AISnapshot> {
  const k = params.k ?? 3;
  const startTime = performance.now();
  let distancesCalculated = 0;
  let pointsClassified = 0;
  let correct = 0;

  const labeled = points.filter((p) => p.label !== undefined);

  // Shuffle and split into train (80%) / test (20%)
  const shuffled = [...labeled].sort(() => Math.random() - 0.5);
  const splitIdx = Math.max(Math.floor(shuffled.length * 0.8), k + 1);
  const train = shuffled.slice(0, splitIdx);
  const test = shuffled.slice(splitIdx).map((p) => ({ ...p }));

  // If not enough test points, generate some with ground-truth labels
  if (test.length < 5) {
    const classes = new Map<number, { sx: number; sy: number; n: number }>();
    for (const p of train) {
      const lbl = p.label ?? 0;
      const entry = classes.get(lbl) ?? { sx: 0, sy: 0, n: 0 };
      entry.sx += p.x;
      entry.sy += p.y;
      entry.n++;
      classes.set(lbl, entry);
    }
    const centroids = [...classes.entries()].map(([lbl, c]) => ({
      label: lbl,
      x: c.sx / c.n,
      y: c.sy / c.n,
    }));
    for (let i = test.length; i < 15; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      let bestLabel = 0;
      let bestDist = Infinity;
      for (const c of centroids) {
        const d = Math.hypot(x - c.x, y - c.y);
        if (d < bestDist) {
          bestDist = d;
          bestLabel = c.label;
        }
      }
      test.push({ x, y, label: bestLabel });
    }
  }

  const snap = (
    testPoint: DataPoint | null,
    neighbors: number[],
  ): AISnapshot => {
    const stats: KNNStats = {
      pointsClassified,
      distancesCalculated,
      accuracy:
        pointsClassified > 0
          ? Math.round((correct / pointsClassified) * 100)
          : 0,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "knn",
      data: {
        points: [...train, ...test],
        testPoint,
        neighbors,
        k,
        stats,
      },
    };
  };

  yield snap(null, []);

  for (const tp of test) {
    // Calculate distances to training points only
    const dists = train.map((p, i) => {
      distancesCalculated++;
      return { index: i, dist: Math.hypot(p.x - tp.x, p.y - tp.y) };
    });

    dists.sort((a, b) => a.dist - b.dist);
    const kNearest = dists.slice(0, k).map((d) => d.index);

    yield snap(tp, kNearest);

    // Majority vote from training labels
    const votes: Record<number, number> = {};
    for (const idx of kNearest) {
      const label = train[idx].label ?? 0;
      votes[label] = (votes[label] ?? 0) + 1;
    }
    const predicted = Number(
      Object.entries(votes).sort(([, a], [, b]) => b - a)[0][0],
    );
    tp.predicted = predicted;
    pointsClassified++;

    // Track accuracy against true label
    if (tp.label !== undefined && tp.label === predicted) correct++;

    yield snap(tp, kNearest);
  }

  yield snap(null, []);
}
