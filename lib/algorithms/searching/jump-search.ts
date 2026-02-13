import type { SearchingSnapshot, AlgorithmStats } from "@/lib/types/algorithms";

export function* jumpSearch(array: number[], target: number) {
  let comparisons = 0;
  let accesses = 0;
  const startTime = performance.now();
  const visited: number[] = [];

  const n = array.length;
  const stepSize = Math.floor(Math.sqrt(n));
  let prev = 0;

  // Finding the block where element is present
  while (array[Math.min(stepSize, n) - 1] < target) {
    comparisons++;
    accesses++;
    visited.push(Math.min(stepSize, n) - 1);

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
      stats,
    } as SearchingSnapshot;

    prev = stepSize;
    prev += stepSize;
    if (prev >= n) {
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

      return;
    }
  }

  // Linear search in the identified block
  while (array[prev] < target) {
    comparisons++;
    accesses++;
    visited.push(prev);

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
      searchIndex: prev,
      stats,
    } as SearchingSnapshot;

    prev += 1;

    if (prev === Math.min(stepSize, n)) {
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

      return;
    }
  }

  // If element is found
  if (array[prev] === target) {
    comparisons++;
    accesses++;
    visited.push(prev);

    const foundStats: AlgorithmStats = {
      comparisons,
      swaps: 0,
      accesses,
      timeElapsed: Math.round(performance.now() - startTime),
    };

    yield {
      array: [...array],
      visited: [...visited],
      found: true,
      searchIndex: prev,
      stats: foundStats,
    } as SearchingSnapshot;

    return;
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
