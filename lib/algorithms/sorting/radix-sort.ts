import type { AlgorithmSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* radixSort(array: number[]) {
  const tracker = createTracker();
  const result = createTrackedArray([...array], tracker);

  const max = Math.max(...tracker.raw(result));
  let exp = 1;

  while (Math.floor(max / exp) > 0) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    for (let i = 0; i < result.length; i++) {
      const digit = Math.floor((result[i] / exp) % 10);
      buckets[digit].push(result[i]);
      tracker.compare();

      yield {
        array: tracker.raw(result),
        comparing: [i, digit],
        special: i,
        stats: tracker.snapshot(),
      } as AlgorithmSnapshot;
    }

    let index = 0;
    for (let i = 0; i < buckets.length; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        result[index] = buckets[i][j];
        index++;
        tracker.swaps++;

        yield {
          array: tracker.raw(result),
          comparing: [i, j],
          stats: tracker.snapshot(),
        } as AlgorithmSnapshot;
      }
    }

    exp *= 10;
  }

  const sorted = Array.from({ length: result.length }, (_, i) => i);

  yield {
    array: tracker.raw(result),
    sorted,
    stats: tracker.snapshot(),
  } as AlgorithmSnapshot;
}
