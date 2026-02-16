import type { AlgorithmSnapshot, AlgorithmStats } from "@/lib/types";

export function* bubbleSort(array: number[]) {
  const result = [...array];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const startTime = performance.now();

  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      comparisons++;
      accesses += 2;

      const stats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...result],
        comparing: [j, j + 1],
        stats,
      } as AlgorithmSnapshot;

      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
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
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          stats: swapStats,
        } as AlgorithmSnapshot;
      }
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
