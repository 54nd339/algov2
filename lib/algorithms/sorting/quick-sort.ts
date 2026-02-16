import type { AlgorithmSnapshot, AlgorithmStats } from "@/lib/types";

export function* quickSort(array: number[]) {
  const result = [...array];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const startTime = performance.now();

  function* partition(
    arr: number[],
    low: number,
    high: number
  ): Generator<AlgorithmSnapshot, number> {
    const pivot = arr[high];
    accesses++;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      accesses++;

      const stats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...arr],
        comparing: [j, high],
        special: high,
        stats,
      } as AlgorithmSnapshot;

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        accesses += 2;

        yield {
          array: [...arr],
          comparing: [j, high],
          swapping: [i, j],
          special: high,
          stats: { comparisons, swaps, accesses, timeElapsed: Math.round(performance.now() - startTime) },
        } as AlgorithmSnapshot;
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    accesses += 2;

    return i + 1;
  }

  function* quickSortHelper(
    arr: number[],
    low: number,
    high: number
  ): Generator<AlgorithmSnapshot> {
    if (low < high) {
      const pi = yield* partition(arr, low, high);
      yield* quickSortHelper(arr, low, pi - 1);
      yield* quickSortHelper(arr, pi + 1, high);
    }
  }

  yield* quickSortHelper(result, 0, result.length - 1);

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
