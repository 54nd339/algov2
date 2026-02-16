import type { SearchingSnapshot, AlgorithmStats } from "@/lib/types";

export function* linearSearch(array: number[], target: number) {
  let comparisons = 0;
  let accesses = 0;
  const startTime = performance.now();

  for (let i = 0; i < array.length; i++) {
    comparisons++;
    accesses++;

    const stats: AlgorithmStats = {
      comparisons,
      swaps: 0,
      accesses,
      timeElapsed: Math.round(performance.now() - startTime),
    };

    yield {
      array: [...array],
      visited: [i],
      found: false,
      stats,
    } as SearchingSnapshot;

    if (array[i] === target) {
      accesses++;

      const foundStats: AlgorithmStats = {
        comparisons,
        swaps: 0,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...array],
        visited: Array.from({ length: i + 1 }, (_, idx) => idx),
        found: true,
        searchIndex: i,
        stats: foundStats,
      } as SearchingSnapshot;

      return;
    }
  }

  const notFoundStats: AlgorithmStats = {
    comparisons,
    swaps: 0,
    accesses,
    timeElapsed: Math.round(performance.now() - startTime),
  };

  yield {
    array: [...array],
    visited: Array.from({ length: array.length }, (_, i) => i),
    found: false,
    stats: notFoundStats,
  } as SearchingSnapshot;
}
