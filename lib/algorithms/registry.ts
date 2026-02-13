import type { AlgorithmSnapshot } from "@/lib/types/algorithms";
import type { PathfindingAlgorithmFn } from "@/lib/types/pathfinding";
import type { GraphAlgorithmFn } from "@/lib/types/graph";
import type { MSTAlgorithmFn } from "@/lib/types/mst";
import type { AIAlgorithmFn } from "@/lib/types/ai";
import type { GamesAlgorithmFn } from "@/lib/types/games";
import type { ClassicAlgorithmFn } from "@/lib/types/classic";
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
} from "@/lib/algorithms/ai";
import {
  nQueen,
  sudoku,
  gameOfLife,
  knightTour,
  minimax,
} from "@/lib/algorithms/games";
import { towerOfHanoi } from "@/lib/algorithms/classic";

type AlgorithmFn = (
  array: number[],
  target?: number,
) => Generator<AlgorithmSnapshot>;

const registry: Record<string, Record<string, AlgorithmFn>> = {
  sorting: {
    "bubble-sort": bubbleSort as AlgorithmFn,
    "insertion-sort": insertionSort as AlgorithmFn,
    "selection-sort": selectionSort as AlgorithmFn,
    "merge-sort": mergeSort as AlgorithmFn,
    "quick-sort": quickSort as AlgorithmFn,
    "heap-sort": heapSort as AlgorithmFn,
    "radix-sort": radixSort as AlgorithmFn,
  },
  searching: {
    "linear-search": linearSearch as AlgorithmFn,
    "binary-search": binarySearch as AlgorithmFn,
    "jump-search": jumpSearch as AlgorithmFn,
  },
};

const pathfindingRegistry: Record<string, PathfindingAlgorithmFn> = {
  "depth-first-search": pfDfs,
  "breadth-first-search": pfBfs,
  dijkstra: pfDijkstra,
  "a-star": aStar,
};

const graphRegistry: Record<string, GraphAlgorithmFn> = {
  dijkstra: spDijkstra,
  "bellman-ford": bellmanFord,
  "floyd-warshall": floydWarshall,
};

const mstRegistry: Record<string, MSTAlgorithmFn> = {
  prim,
  kruskal,
};

const aiRegistry: Record<string, AIAlgorithmFn> = {
  "linear-regression": linearRegression,
  knn,
  "k-means": kMeans,
};

const gamesRegistry: Record<string, GamesAlgorithmFn> = {
  "n-queen": nQueen,
  sudoku,
  "game-of-life": gameOfLife,
  "knight-tour": knightTour,
  minimax,
};

export function getAlgorithm(
  category: string,
  algorithmId: string,
): AlgorithmFn | undefined {
  return registry[category]?.[algorithmId];
}

export function getPathfindingAlgorithm(
  algorithmId: string,
): PathfindingAlgorithmFn | undefined {
  return pathfindingRegistry[algorithmId];
}

export function getGraphAlgorithm(
  algorithmId: string,
): GraphAlgorithmFn | undefined {
  return graphRegistry[algorithmId];
}

export function getMSTAlgorithm(
  algorithmId: string,
): MSTAlgorithmFn | undefined {
  return mstRegistry[algorithmId];
}

export function getAIAlgorithm(
  algorithmId: string,
): AIAlgorithmFn | undefined {
  return aiRegistry[algorithmId];
}

export function getGamesAlgorithm(
  algorithmId: string,
): GamesAlgorithmFn | undefined {
  return gamesRegistry[algorithmId];
}

const classicRegistry: Record<string, ClassicAlgorithmFn> = {
  "tower-of-hanoi": towerOfHanoi,
};

export function getClassicAlgorithm(
  algorithmId: string,
): ClassicAlgorithmFn | undefined {
  return classicRegistry[algorithmId];
}
