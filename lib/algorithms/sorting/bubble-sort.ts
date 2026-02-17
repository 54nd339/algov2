import type { AlgorithmSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* bubbleSort(array: number[]) {
  const tracker = createTracker();
  const result = createTrackedArray([...array], tracker);

  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      tracker.compare();

      yield {
        array: tracker.raw(result),
        comparing: [j, j + 1],
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;

      if (result[j] > result[j + 1]) {
        tracker.swap(result, j, j + 1);

        yield {
          array: tracker.raw(result),
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          stats: tracker.snapshot(),
        } as AlgorithmSnapshot;
      }
    }
  }

  const sorted = Array.from({ length: result.length }, (_, i) => i);

  yield {
    array: tracker.raw(result),
    sorted,
    stats: tracker.snapshot(),
  } as AlgorithmSnapshot;
}
