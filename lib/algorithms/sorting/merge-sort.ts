import type { AlgorithmSnapshot, AlgorithmStats } from "@/lib/types";

export function* mergeSort(array: number[]) {
  const result = [...array];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const startTime = performance.now();

  function* mergeSortHelper(
    arr: number[],
    left: number,
    right: number
  ): Generator<AlgorithmSnapshot> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      yield* mergeSortHelper(arr, left, mid);
      yield* mergeSortHelper(arr, mid + 1, right);
      yield* merge(arr, left, mid, right);
    }
  }

  function* merge(
    arr: number[],
    left: number,
    mid: number,
    right: number
  ): Generator<AlgorithmSnapshot> {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
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
        comparing: [left + i, mid + 1 + j],
        stats,
      } as AlgorithmSnapshot;

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        swaps++;
        accesses++;

        yield {
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          swapping: [k, left + i],
          stats: { comparisons, swaps, accesses, timeElapsed: Math.round(performance.now() - startTime) },
        } as AlgorithmSnapshot;

        i++;
      } else {
        arr[k] = rightArr[j];
        swaps++;
        accesses++;

        yield {
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          swapping: [k, mid + 1 + j],
          stats: { comparisons, swaps, accesses, timeElapsed: Math.round(performance.now() - startTime) },
        } as AlgorithmSnapshot;

        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
      swaps++;
      accesses++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
      swaps++;
      accesses++;
    }
  }

  yield* mergeSortHelper(result, 0, result.length - 1);

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
