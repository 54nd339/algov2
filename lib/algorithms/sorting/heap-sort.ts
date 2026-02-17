import type { AlgorithmSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* heapSort(array: number[]) {
  const tracker = createTracker();
  const result = createTrackedArray([...array], tracker);

  function* heapify(
    arr: number[],
    n: number,
    i: number
  ): Generator<AlgorithmSnapshot> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      tracker.compare();

      yield {
        array: tracker.raw(arr),
        comparing: [largest, left],
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      tracker.compare();

      yield {
        array: tracker.raw(arr),
        comparing: [largest, right],
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      tracker.swap(arr, i, largest);

      yield {
        array: tracker.raw(arr),
        comparing: [i, largest],
        swapping: [i, largest],
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      yield* heapify(arr, n, largest);
    }
  }

  const n = result.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(result, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    tracker.swap(result, 0, i);

    yield {
      array: tracker.raw(result),
      comparing: [0, i],
      swapping: [0, i],
      special: 0,
      stats: tracker.snapshot(),
    } as AlgorithmSnapshot;

    yield* heapify(result, i, 0);
  }

  const sorted = Array.from({ length: result.length }, (_, i) => i);

  yield {
    array: tracker.raw(result),
    sorted,
    stats: tracker.snapshot(),
  } as AlgorithmSnapshot;
}
