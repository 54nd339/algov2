import type { AlgorithmSnapshot, AlgorithmStats } from "@/lib/types";

export function* radixSort(array: number[]) {
  const result = [...array];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const startTime = performance.now();

  const max = Math.max(...result);
  let exp = 1;

  while (Math.floor(max / exp) > 0) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    for (let i = 0; i < result.length; i++) {
      const digit = Math.floor((result[i] / exp) % 10);
      buckets[digit].push(result[i]);
      accesses += 2;
      comparisons++;

      const stats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...result],
        comparing: [i, digit],
        special: i,
        stats,
      } as AlgorithmSnapshot;
    }

    let index = 0;
    for (let i = 0; i < buckets.length; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        result[index] = buckets[i][j];
        index++;
        swaps++;
        accesses++;

        const stats: AlgorithmStats = {
          comparisons,
          swaps,
          accesses,
          timeElapsed: Math.round(performance.now() - startTime),
        };

        yield {
          array: [...result],
          comparing: [i, j],
          stats,
        } as AlgorithmSnapshot;
      }
    }

    exp *= 10;
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
