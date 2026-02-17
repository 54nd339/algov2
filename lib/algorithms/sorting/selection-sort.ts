import type { AlgorithmSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* selectionSort(array: number[]) {
  const tracker = createTracker();
  const result = createTrackedArray([...array], tracker);

  for (let i = 0; i < result.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < result.length; j++) {
      tracker.compare();

      yield {
        array: tracker.raw(result),
        comparing: [minIndex, j],
        special: minIndex,
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      tracker.swap(result, i, minIndex);

      yield {
        array: tracker.raw(result),
        comparing: [i, minIndex],
        swapping: [i, minIndex],
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;
    }
  }

  const sorted = Array.from({ length: result.length }, (_, i) => i);

  yield {
    array: tracker.raw(result),
    sorted,
    stats: tracker.snapshot(),
  } as AlgorithmSnapshot;
}
