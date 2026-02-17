import type { SearchingSnapshot } from "@/lib/types";
import { createTracker, createTrackedArray } from "@/lib/algorithms/shared";

export function* jumpSearch(array: number[], target: number) {
  const tracker = createTracker();
  const arr = createTrackedArray([...array], tracker);
  const visited: number[] = [];

  const n = arr.length;
  const stepSize = Math.floor(Math.sqrt(n));
  let prev = 0;

  while (arr[Math.min(stepSize, n) - 1] < target) {
    tracker.compare();
    visited.push(Math.min(stepSize, n) - 1);

    yield {
      array: tracker.raw(arr),
      visited: [...visited],
      found: false,
      stats: tracker.snapshot(),
    } as SearchingSnapshot;

    prev = stepSize;
    prev += stepSize;
    if (prev >= n) {
      yield {
        array: tracker.raw(arr),
        visited: [...visited],
        found: false,
        stats: tracker.snapshot(),
      } as SearchingSnapshot;

      return;
    }
  }

  while (arr[prev] < target) {
    tracker.compare();
    visited.push(prev);

    yield {
      array: tracker.raw(arr),
      visited: [...visited],
      found: false,
      searchIndex: prev,
      stats: tracker.snapshot(),
    } as SearchingSnapshot;

    prev += 1;

    if (prev === Math.min(stepSize, n)) {
      yield {
        array: tracker.raw(arr),
        visited: [...visited],
        found: false,
        stats: tracker.snapshot(),
      } as SearchingSnapshot;

      return;
    }
  }

  if (arr[prev] === target) {
    tracker.compare();
    visited.push(prev);

    yield {
      array: tracker.raw(arr),
      visited: [...visited],
      found: true,
      searchIndex: prev,
      stats: tracker.snapshot(),
    } as SearchingSnapshot;

    return;
  }

  yield {
    array: tracker.raw(arr),
    visited: [...visited],
    found: false,
    stats: tracker.snapshot(),
  } as SearchingSnapshot;
}
