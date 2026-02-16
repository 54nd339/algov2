import type { DataPoint, AISnapshot, RegressionStats } from "@/lib/types";

/* ── Linear Regression via Gradient Descent ─────────────────────── */

export function* linearRegression(
  points: DataPoint[],
  params: { learningRate?: number },
): Generator<AISnapshot> {
  const lr = params.learningRate ?? 0.0001;
  let slope = 0;
  let intercept = 0;
  const n = points.length;
  const startTime = performance.now();
  const maxEpochs = 200;

  const calcMSE = (): number => {
    let sum = 0;
    for (const p of points) {
      const pred = slope * p.x + intercept;
      sum += (p.y - pred) ** 2;
    }
    return sum / n;
  };

  const calcR2 = (): number => {
    const meanY = points.reduce((s, p) => s + p.y, 0) / n;
    let ssRes = 0;
    let ssTot = 0;
    for (const p of points) {
      const pred = slope * p.x + intercept;
      ssRes += (p.y - pred) ** 2;
      ssTot += (p.y - meanY) ** 2;
    }
    return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  };

  const snap = (epoch: number): AISnapshot => {
    const mse = calcMSE();
    const stats: RegressionStats = {
      epoch,
      mse: Math.round(mse * 100) / 100,
      rmse: Math.round(Math.sqrt(mse) * 100) / 100,
      rSquared: Math.round(calcR2() * 1000) / 1000,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "regression",
      data: { points, slope, intercept, stats },
    };
  };

  yield snap(0);

  let prevR2 = -Infinity;
  let stableCount = 0;

  for (let epoch = 1; epoch <= maxEpochs; epoch++) {
    let dSlope = 0;
    let dIntercept = 0;
    for (const p of points) {
      const pred = slope * p.x + intercept;
      const error = pred - p.y;
      dSlope += error * p.x;
      dIntercept += error;
    }
    slope -= (lr * dSlope * 2) / n;
    intercept -= (lr * dIntercept * 2) / n;

    const currentR2 = calcR2();
    yield snap(epoch);

    // Avoid wasted epochs once the model has converged
    if (Math.abs(currentR2 - prevR2) < 0.0005) {
      stableCount++;
      if (stableCount >= 10) break;
    } else {
      stableCount = 0;
    }
    prevR2 = currentR2;
  }
}
