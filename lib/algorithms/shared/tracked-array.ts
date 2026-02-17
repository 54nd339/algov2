import type { AlgorithmStats } from "@/lib/types";

/**
 * Mutable stat counters with helpers for comparisons, swaps, and snapshots.
 * Pass to `createTrackedArray` to auto-count array accesses via Proxy.
 */
export interface AlgoTracker {
  comparisons: number;
  swaps: number;
  accesses: number;
  /** Record one comparison (does NOT touch the array). */
  compare: () => void;
  /** Swap arr[i] and arr[j], incrementing swap + access counters. */
  swap: (arr: number[], i: number, j: number) => void;
  /** Return an immutable `AlgorithmStats` snapshot. */
  snapshot: () => AlgorithmStats;
  /** Return a plain copy of the proxied array (for yielding in snapshots). */
  raw: (arr: number[]) => number[];
}

/** WeakMap linking proxied arrays back to their raw backing array. */
const proxyBacking = new WeakMap<number[], number[]>();

export function createTracker(): AlgoTracker {
  const startTime = performance.now();

  const tracker: AlgoTracker = {
    comparisons: 0,
    swaps: 0,
    accesses: 0,

    compare() {
      tracker.comparisons++;
    },

    swap(arr: number[], i: number, j: number) {
      // Access the raw backing array to avoid double-counting via the proxy
      const rawArr = proxyBacking.get(arr) ?? arr;
      const tmp = rawArr[i];
      rawArr[i] = rawArr[j];
      rawArr[j] = tmp;
      tracker.swaps++;
      // Each swap reads 2 + writes 2 = 4 accesses
      tracker.accesses += 4;
    },

    snapshot(): AlgorithmStats {
      return {
        comparisons: tracker.comparisons,
        swaps: tracker.swaps,
        accesses: tracker.accesses,
        timeElapsed: Math.round(performance.now() - startTime),
      };
    },

    raw(arr: number[]): number[] {
      const backing = proxyBacking.get(arr) ?? arr;
      return [...backing];
    },
  };

  return tracker;
}

/**
 * Wrap a `number[]` in a Proxy that automatically increments
 * `tracker.accesses` on every numeric-index read or write.
 */
export function createTrackedArray(
  source: number[],
  tracker: AlgoTracker,
): number[] {
  const proxy = new Proxy(source, {
    get(target, prop, receiver) {
      const index = typeof prop === "string" ? Number(prop) : NaN;
      if (!Number.isNaN(index) && Number.isInteger(index) && index >= 0) {
        tracker.accesses++;
      }
      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      const index = typeof prop === "string" ? Number(prop) : NaN;
      if (!Number.isNaN(index) && Number.isInteger(index) && index >= 0) {
        tracker.accesses++;
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });

  proxyBacking.set(proxy, source);

  return proxy;
}
