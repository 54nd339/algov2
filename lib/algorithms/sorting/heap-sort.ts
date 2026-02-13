import type { AlgorithmSnapshot, AlgorithmStats } from "@/lib/types/algorithms";

export function* heapSort(array: number[]) {
  const result = [...array];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const startTime = performance.now();

  function* heapify(
    arr: number[],
    n: number,
    i: number
  ): Generator<AlgorithmSnapshot> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      comparisons++;
      accesses += 2;

      const stats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...arr],
        comparing: [largest, left],
        stats,
      } as AlgorithmSnapshot;

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      comparisons++;
      accesses += 2;

      const stats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...arr],
        comparing: [largest, right],
        stats,
      } as AlgorithmSnapshot;

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      swaps++;
      accesses += 2;

      const swapStats: AlgorithmStats = {
        comparisons,
        swaps,
        accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };

      yield {
        array: [...arr],
        comparing: [i, largest],
        stats: swapStats,
      } as AlgorithmSnapshot;

      yield* heapify(arr, n, largest);
    }
  }

  const n = result.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(result, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    swaps++;
    accesses += 2;

    const stats: AlgorithmStats = {
      comparisons,
      swaps,
      accesses,
      timeElapsed: Math.round(performance.now() - startTime),
    };

    yield {
      array: [...result],
      comparing: [0, i],
      stats,
    } as AlgorithmSnapshot;

    yield* heapify(result, i, 0);
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
