import {
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
  heapSort,
  radixSort,
} from "@/lib/algorithms/sorting";
import {
  linearSearch,
  binarySearch,
  jumpSearch,
} from "@/lib/algorithms/searching";
import {
  dfs as pfDfs,
  bfs as pfBfs,
  dijkstra as pfDijkstra,
  aStar,
} from "@/lib/algorithms/pathfinding";
import {
  dijkstra as spDijkstra,
  bellmanFord,
  floydWarshall,
} from "@/lib/algorithms/shortest-path";
import { prim, kruskal } from "@/lib/algorithms/mst";
import {
  linearRegression,
  knn,
  kMeans,
  perceptron,
} from "@/lib/algorithms/ai";
import {
  nQueen,
  sudoku,
  gameOfLife,
  knightTour,
  minimax,
} from "@/lib/algorithms/games";
import { towerOfHanoi } from "@/lib/algorithms/classic";

/* eslint-disable @typescript-eslint/no-explicit-any -- algorithm signatures vary per category (sorting takes array, pathfinding takes grid, etc.), making a single generic type impractical */

/**
 * Single unified registry keyed by category → algorithmId → generator function.
 * Consumers cast to the correct type via the typed getter overloads.
 */
const registry: Record<string, Record<string, any>> = {
  sorting: {
    "bubble-sort": bubbleSort,
    "insertion-sort": insertionSort,
    "selection-sort": selectionSort,
    "merge-sort": mergeSort,
    "quick-sort": quickSort,
    "heap-sort": heapSort,
    "radix-sort": radixSort,
  },
  searching: {
    "linear-search": linearSearch,
    "binary-search": binarySearch,
    "jump-search": jumpSearch,
  },
  "path-finding": {
    "depth-first-search": pfDfs,
    "breadth-first-search": pfBfs,
    dijkstra: pfDijkstra,
    "a-star": aStar,
  },
  "shortest-path": {
    dijkstra: spDijkstra,
    "bellman-ford": bellmanFord,
    "floyd-warshall": floydWarshall,
  },
  mst: {
    prim,
    kruskal,
  },
  ai: {
    "linear-regression": linearRegression,
    knn,
    "k-means": kMeans,
    perceptron,
  },
  games: {
    "n-queen": nQueen,
    sudoku,
    "game-of-life": gameOfLife,
    "knight-tour": knightTour,
    minimax,
  },
  classic: {
    "tower-of-hanoi": towerOfHanoi,
  },
};

/**
 * Look up any algorithm by its category and id.
 * Returns `undefined` if the combination doesn't exist.
 */
export function getAlgorithm<T = any>(
  category: string,
  algorithmId: string,
): T | undefined {
  return registry[category]?.[algorithmId] as T | undefined;
}
