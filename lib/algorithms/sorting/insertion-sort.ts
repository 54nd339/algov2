import type { AlgorithmSnapshot, AlgorithmStats } from "@/lib/types";

export function* insertionSort(array: number[]) {
  const result = [...array];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const startTime = performance.now();

  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    accesses++;
    let j = i - 1;

    while (j >= 0) {
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
        comparing: [j, i],
        special: i,
        stats,
      } as AlgorithmSnapshot;

      if (result[j] <= key) break;

      result[j + 1] = result[j];
      swaps++;
      accesses++;
      j--;
    }

    result[j + 1] = key;
    accesses++;
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
