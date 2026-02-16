import type { SearchingSnapshot, AlgorithmStats } from "@/lib/types";

export function* binarySearch(array: number[], target: number) {
  let left = 0;
  let right = array.length - 1;
  let comparisons = 0;
  let accesses = 0;
  const startTime = performance.now();
  const visited: number[] = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;
    accesses++;
    visited.push(mid);

    const stats: AlgorithmStats = {
      comparisons,
      swaps: 0,
      accesses,
      timeElapsed: Math.round(performance.now() - startTime),
    };

    yield {
      array: [...array],
      visited: [...visited],
      found: false,
      searchIndex: mid,
      stats,
    } as SearchingSnapshot;

    if (array[mid] === target) {
      const foundStats: AlgorithmStats = {
        comparisons,
        swaps: 0,
        accesses: accesses + 1,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...array],
        visited: [...visited],
        found: true,
        searchIndex: mid,
        stats: foundStats,
      } as SearchingSnapshot;

      return;
    }

    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
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
    visited: [...visited],
    found: false,
    stats: notFoundStats,
  } as SearchingSnapshot;
}
