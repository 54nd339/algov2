import type { AlgorithmSnapshot, AlgorithmStats } from "@/lib/types/algorithms";

export function* selectionSort(array: number[]) {
  const result = [...array];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const startTime = performance.now();

  for (let i = 0; i < result.length - 1; i++) {
    let minIndex = i;
    accesses++;

    for (let j = i + 1; j < result.length; j++) {
      comparisons++;
      accesses++;

      const stats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...result],
        comparing: [minIndex, j],
        stats,
      } as AlgorithmSnapshot;

      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [result[i], result[minIndex]] = [result[minIndex], result[i]];
      swaps++;
      accesses += 2;

      const swapStats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...result],
        comparing: [i, minIndex],
        stats: swapStats,
      } as AlgorithmSnapshot;
    }
  }

  const sorted = Array.from({ length: result.length }, (_, i) => i);
  const finalStats: AlgorithmStats = {
    comparisons,
    swaps,
    accesses,
    timeElapsed: Math.round(performance.now() - startTime),
  };

  yield {
    array: result,
    sorted,
    stats: finalStats,
  } as AlgorithmSnapshot;
}
