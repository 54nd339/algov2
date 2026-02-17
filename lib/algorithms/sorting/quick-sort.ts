import type { AlgorithmSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* quickSort(array: number[]) {
  const tracker = createTracker();
  const result = createTrackedArray([...array], tracker);

  function* partition(
    arr: number[],
    low: number,
    high: number
  ): Generator<AlgorithmSnapshot, number> {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      tracker.compare();

      yield {
        array: tracker.raw(arr),
        comparing: [j, high],
        special: high,
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      if (arr[j] < pivot) {
        i++;
        tracker.swap(arr, i, j);

        yield {
          array: tracker.raw(arr),
          comparing: [j, high],
          swapping: [i, j],
          special: high,
          stats: tracker.snapshot(),
        } as AlgorithmSnapshot;
      }
    }

    tracker.swap(arr, i + 1, high);

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

  yield {
    array: tracker.raw(result),
    sorted,
    stats: tracker.snapshot(),
  } as AlgorithmSnapshot;
}
