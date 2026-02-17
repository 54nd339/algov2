import type { AlgorithmSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* insertionSort(array: number[]) {
  const tracker = createTracker();
  const result = createTrackedArray([...array], tracker);

  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;

    while (j >= 0) {
      tracker.compare();

      yield {
        array: tracker.raw(result),
        comparing: [j, i],
        special: i,
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      if (result[j] <= key) break;

      result[j + 1] = result[j];
      tracker.swaps++;
      j--;
    }

    result[j + 1] = key;
  }

  const sorted = Array.from({ length: result.length }, (_, i) => i);

  yield {
    array: tracker.raw(result),
    sorted,
    stats: tracker.snapshot(),
  } as AlgorithmSnapshot;
}
