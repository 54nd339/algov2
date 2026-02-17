import type { AlgorithmSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* mergeSort(array: number[]) {
  const tracker = createTracker();
  const result = createTrackedArray([...array], tracker);

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
    const leftArr = tracker.raw(arr).slice(left, mid + 1);
    const rightArr = tracker.raw(arr).slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      tracker.compare();

      yield {
        array: tracker.raw(arr),
        comparing: [left + i, mid + 1 + j],
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        tracker.swaps++;

        yield {
          array: tracker.raw(arr),
          comparing: [left + i, mid + 1 + j],
          swapping: [k, left + i],
          stats: tracker.snapshot(),
        } as AlgorithmSnapshot;

        i++;
      } else {
        arr[k] = rightArr[j];
        tracker.swaps++;

        yield {
          array: tracker.raw(arr),
          comparing: [left + i, mid + 1 + j],
          swapping: [k, mid + 1 + j],
          stats: tracker.snapshot(),
        } as AlgorithmSnapshot;

        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      tracker.swaps++;
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      tracker.swaps++;
      j++;
      k++;
    }
  }

  yield* mergeSortHelper(result, 0, result.length - 1);

  const sorted = Array.from({ length: result.length }, (_, i) => i);

  yield {
    array: tracker.raw(result),
    sorted,
    stats: tracker.snapshot(),
  } as AlgorithmSnapshot;
}
