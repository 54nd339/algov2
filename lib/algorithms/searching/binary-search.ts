import type { SearchingSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* binarySearch(array: number[], target: number) {
  const tracker = createTracker();
  const arr = createTrackedArray([...array], tracker);
  let left = 0;
  let right = arr.length - 1;
  const visited: number[] = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    tracker.compare();
    visited.push(mid);

    yield {
      array: tracker.raw(arr),
      visited: [...visited],
      found: false,
      searchIndex: mid,
      stats: tracker.snapshot(),
    } as SearchingSnapshot;

    if (arr[mid] === target) {
      yield {
        array: tracker.raw(arr),
        visited: [...visited],
        found: true,
        searchIndex: mid,
        stats: tracker.snapshot(),
      } as SearchingSnapshot;

      return;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  yield {
    array: tracker.raw(arr),
    visited: [...visited],
    found: false,
    stats: tracker.snapshot(),
  } as SearchingSnapshot;
}
