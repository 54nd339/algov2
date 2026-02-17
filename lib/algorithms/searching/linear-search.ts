import type { SearchingSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* linearSearch(array: number[], target: number) {
  const tracker = createTracker();
  const arr = createTrackedArray([...array], tracker);

  for (let i = 0; i < arr.length; i++) {
    tracker.compare();

    yield {
      array: tracker.raw(arr),
      visited: [i],
      found: false,
      stats: tracker.snapshot(),
    } as SearchingSnapshot;

    if (arr[i] === target) {
      yield {
        array: tracker.raw(arr),
        visited: Array.from({ length: i + 1 }, (_, idx) => idx),
        found: true,
        searchIndex: i,
        stats: tracker.snapshot(),
      } as SearchingSnapshot;

      return;
    }
  }

  yield {
    array: tracker.raw(arr),
    visited: Array.from({ length: arr.length }, (_, i) => i),
    found: false,
    stats: tracker.snapshot(),
  } as SearchingSnapshot;
}
