import {
  ArrowUpDown,
  Search,
  Route,
  Network,
  GitFork,
  Brain,
  Gamepad2,
  Layers,
  type LucideIcon,
} from "lucide-react";
import type { AlgorithmMetadata } from "@/lib/types";

export interface Algorithm extends AlgorithmMetadata {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  algorithms: Algorithm[];
}

const sortingAlgorithms: Algorithm[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    description:
      "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    sourceCode: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if out of order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
}`,
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    description:
      "Builds the sorted array one item at a time by repeatedly taking elements from the unsorted portion and inserting them into their correct position in the sorted portion.",
    sourceCode: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    // Shift elements that are greater than key
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // Place key in its correct position
    arr[j + 1] = key;
  }

  return arr;
}`,
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
  },
  {
    id: "selection-sort",
    name: "Selection Sort",
    description:
      "Divides the array into sorted and unsorted portions, iteratively selecting the smallest element from the unsorted portion and moving it to the sorted portion.",
    sourceCode: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Find the smallest element in unsorted portion
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap it with the first unsorted element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}`,
    complexity: {
      time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
    stable: false,
    inPlace: true,
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    description:
      "A divide-and-conquer algorithm that recursively divides the array into halves, sorts them, and merges the sorted halves back together.",
    sourceCode: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // Append remaining elements
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      space: "O(n)",
    },
    stable: true,
    inPlace: false,
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    description:
      "A divide-and-conquer algorithm that partitions the array around a pivot element and recursively sorts the partitions.",
    sourceCode: `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Place pivot in its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
      space: "O(log n)",
    },
    stable: false,
    inPlace: true,
  },
  {
    id: "heap-sort",
    name: "Heap Sort",
    description:
      "Uses a heap data structure to sort elements by repeatedly extracting the maximum element and placing it at the end of the array.",
    sourceCode: `function heapSort(arr: number[]): number[] {
  const n = arr.length;

  // Build a max heap from the array
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, i, n);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, 0, i);
  }

  return arr;
}

function heapify(arr: number[], i: number, size: number) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, largest, size);
  }
}`,
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      space: "O(1)",
    },
    stable: false,
    inPlace: true,
  },
  {
    id: "radix-sort",
    name: "Radix Sort",
    description:
      "A non-comparison sorting algorithm that sorts integers by processing individual digits from least to most significant.",
    sourceCode: `function radixSort(arr: number[]): number[] {
  const max = Math.max(...arr);

  // Sort by each digit, from least to most significant
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }

  return arr;
}

function countingSortByDigit(arr: number[], exp: number) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // Count occurrences of each digit
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Convert counts to positions
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build sorted output (traverse right-to-left for stability)
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  // Copy back
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`,
    complexity: {
      time: { best: "O(nk)", average: "O(nk)", worst: "O(nk)" },
      space: "O(n + k)",
    },
    stable: true,
    inPlace: false,
  },
];

const searchingAlgorithms: Algorithm[] = [
  {
    id: "linear-search",
    name: "Linear Search",
    description:
      "A simple search algorithm that checks every element in the array sequentially until the target is found or the array is exhausted.",
    sourceCode: `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }

  return -1; // Not found
}`,
    complexity: {
      time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description:
      "An efficient search algorithm that repeatedly divides the sorted array in half to narrow down the search space.",
    sourceCode: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Found at mid
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return -1; // Not found
}`,
    complexity: {
      time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
  },
  {
    id: "jump-search",
    name: "Jump Search",
    description:
      "A search algorithm that jumps through the array in fixed steps and then performs a linear search in the identified block.",
    sourceCode: `function jumpSearch(arr: number[], target: number): number {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = step;

  // Jump ahead in blocks of size √n
  while (curr < n && arr[curr - 1] < target) {
    prev = curr;
    curr += step;
  }

  // Linear search within the identified block
  for (let i = prev; i < Math.min(curr, n); i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }

  return -1; // Not found
}`,
    complexity: {
      time: { best: "O(1)", average: "O(√n)", worst: "O(√n)" },
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
  },
];

const pathFindingAlgorithms: Algorithm[] = [
  {
    id: "depth-first-search",
    name: "Depth First Search",
    description:
      "Explores as far as possible along each branch before backtracking. Uses a stack data structure. Does not guarantee the shortest path on unweighted grids.",
    sourceCode: `function dfs(grid: Cell[][], start: Cell, end: Cell): Cell[] {
  const visited: Cell[] = [];
  const stack: Cell[] = [start];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.isWall || node.isVisited) continue;

    node.isVisited = true;
    visited.push(node);

    if (node === end) break;

    // Push unvisited neighbors onto the stack
    for (const neighbor of getNeighbors(node, grid)) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = node;
        stack.push(neighbor);
      }
    }
  }

  return visited;
}`,
    complexity: {
      time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
      space: "O(V)",
    },
    stable: false,
    inPlace: true,
  },
  {
    id: "breadth-first-search",
    name: "Breadth First Search",
    description:
      "Explores all nodes at the current depth before moving to the next level. Uses a queue. Guarantees the shortest path on unweighted grids.",
    sourceCode: `function bfs(grid: Cell[][], start: Cell, end: Cell): Cell[] {
  const visited: Cell[] = [];
  const queue: Cell[] = [start];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.isWall || node.isVisited) continue;

    node.isVisited = true;
    visited.push(node);

    if (node === end) break;

    // Enqueue unvisited neighbors
    for (const neighbor of getNeighbors(node, grid)) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = node;
        queue.push(neighbor);
      }
    }
  }

  return visited;
}`,
    complexity: {
      time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
      space: "O(V)",
    },
    stable: true,
    inPlace: true,
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description:
      "Finds the shortest path from a start node to all other nodes by always expanding the nearest unvisited node. On a uniform-weight grid, behaves similarly to BFS but with explicit distance tracking.",
    sourceCode: `function dijkstra(grid: Cell[][], start: Cell, end: Cell): Cell[] {
  const visited: Cell[] = [];
  start.distance = 0;
  const unvisited: Cell[] = [start];

  while (unvisited.length > 0) {
    // Sort by distance (priority queue)
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift()!;

    if (closest.distance === Infinity) break;
    if (closest.isWall) continue;

    closest.isVisited = true;
    visited.push(closest);

    if (closest === end) break;

    // Relax neighbors
    for (const neighbor of getNeighbors(closest, grid)) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const newDist = closest.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.previousNode = closest;
          unvisited.push(neighbor);
        }
      }
    }
  }

  return visited;
}`,
    complexity: {
      time: { best: "O(V + E log V)", average: "O(V + E log V)", worst: "O(V + E log V)" },
      space: "O(V)",
    },
    stable: true,
    inPlace: false,
  },
  {
    id: "a-star",
    name: "A* Search",
    description:
      "An informed search algorithm that uses a heuristic (Manhattan distance) to guide exploration toward the target. Combines Dijkstra's approach with a heuristic for faster convergence. Guarantees the shortest path when the heuristic is admissible.",
    sourceCode: `function aStar(grid: Cell[][], start: Cell, end: Cell): Cell[] {
  const visited: Cell[] = [];
  start.distance = 0;
  start.heuristic = manhattan(start, end);
  const open: Cell[] = [start];

  while (open.length > 0) {
    // Sort by f(n) = distance + heuristic
    open.sort((a, b) =>
      (a.distance + a.heuristic) - (b.distance + b.heuristic)
    );
    const current = open.shift()!;

    if (current.isWall) continue;
    current.isVisited = true;
    visited.push(current);

    if (current === end) break;

    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const newDist = current.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.heuristic = manhattan(neighbor, end);
          neighbor.previousNode = current;
          open.push(neighbor);
        }
      }
    }
  }

  return visited;
}

function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}`,
    complexity: {
      time: { best: "O(V + E log V)", average: "O(V + E log V)", worst: "O(V + E log V)" },
      space: "O(V)",
    },
    stable: true,
    inPlace: false,
  },
];

const shortestPathAlgorithms: Algorithm[] = [
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description:
      "Finds the shortest paths from a single source to all other nodes in a weighted graph with non-negative edge weights. Uses a greedy approach, always expanding the nearest unvisited node.",
    sourceCode: `function dijkstra(nodes: Node[], edges: Edge[], source: number) {
  const dist: Record<number, number> = {};
  const prev: Record<number, number[]> = {};
  const visited = new Set<number>();

  // Initialize distances
  nodes.forEach(n => {
    dist[n.id] = n.id === source ? 0 : Infinity;
    prev[n.id] = n.id === source ? [source] : [];
  });

  // Build adjacency list
  const adj = buildAdjacencyList(nodes, edges);
  const unvisited = nodes.map(n => n.id);

  while (unvisited.length > 0) {
    // Find node with minimum distance
    const u = unvisited.reduce((min, id) =>
      dist[id] < dist[min] ? id : min
    , unvisited[0]);

    unvisited.splice(unvisited.indexOf(u), 1);
    visited.add(u);
    if (dist[u] === Infinity) break;

    // Relax neighbors
    for (const { to, weight } of adj[u]) {
      if (!visited.has(to)) {
        const newDist = dist[u] + weight;
        if (newDist < dist[to]) {
          dist[to] = newDist;
          prev[to] = [...prev[u], to];
        }
      }
    }
  }

  return { distances: dist, paths: prev };
}`,
    complexity: {
      time: { best: "O(V²)", average: "O(V²)", worst: "O(V²)" },
      space: "O(V)",
    },
    stable: true,
    inPlace: false,
  },
  {
    id: "bellman-ford",
    name: "Bellman-Ford",
    description:
      "Finds shortest paths from a single source, handling negative edge weights. Runs V-1 relaxation passes over all edges. Can detect negative-weight cycles.",
    sourceCode: `function bellmanFord(nodes: Node[], edges: Edge[], source: number) {
  const dist: Record<number, number> = {};
  const prev: Record<number, number[]> = {};

  // Initialize distances
  nodes.forEach(n => {
    dist[n.id] = n.id === source ? 0 : Infinity;
    prev[n.id] = n.id === source ? [source] : [];
  });

  // Relax edges V-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    for (const { u, v, weight } of edges) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = [...prev[u], v];
      }
      // Undirected: relax both directions
      if (dist[v] + weight < dist[u]) {
        dist[u] = dist[v] + weight;
        prev[u] = [...prev[v], u];
      }
    }
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (const { u, v, weight } of edges) {
    if (dist[u] + weight < dist[v] ||
        dist[v] + weight < dist[u]) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { distances: dist, paths: prev, hasNegativeCycle };
}`,
    complexity: {
      time: { best: "O(VE)", average: "O(VE)", worst: "O(VE)" },
      space: "O(V)",
    },
    stable: true,
    inPlace: false,
  },
  {
    id: "floyd-warshall",
    name: "Floyd-Warshall",
    description:
      "Computes shortest paths between all pairs of nodes using dynamic programming. Has a simple triple-nested loop structure. Works with negative weights but not negative cycles.",
    sourceCode: `function floydWarshall(nodes: Node[], edges: Edge[]) {
  const ids = nodes.map(n => n.id);
  const dist: Record<number, Record<number, number>> = {};

  // Initialize distance matrix
  ids.forEach(i => {
    dist[i] = {};
    ids.forEach(j => {
      dist[i][j] = i === j ? 0 : Infinity;
    });
  });

  // Set direct edge distances
  edges.forEach(({ u, v, weight }) => {
    dist[u][v] = Math.min(dist[u][v], weight);
    dist[v][u] = Math.min(dist[v][u], weight);
  });

  // Triple loop: try each node as intermediate
  for (const k of ids) {
    for (const i of ids) {
      for (const j of ids) {
        const through = dist[i][k] + dist[k][j];
        if (through < dist[i][j]) {
          dist[i][j] = through;
        }
      }
    }
  }

  return { distances: dist };
}`,
    complexity: {
      time: { best: "O(V³)", average: "O(V³)", worst: "O(V³)" },
      space: "O(V²)",
    },
    stable: true,
    inPlace: false,
  },
];

/* ── MST Algorithms ─────────────────────────────────────────────── */

const mstAlgorithms: Algorithm[] = [
  {
    id: "prim",
    name: "Prim's Algorithm",
    description:
      "A greedy algorithm that builds the minimum spanning tree by growing it one edge at a time, always choosing the lightest edge that connects a new vertex to the tree.",
    sourceCode: `function prim(nodes: Node[], edges: Edge[]): Edge[] {
  const adj = buildAdjacencyList(nodes, edges);
  const inMST = new Set<number>();
  const mstEdges: Edge[] = [];
  let totalWeight = 0;

  // Start from node 0
  inMST.add(nodes[0].id);

  while (inMST.size < nodes.length) {
    let bestEdge = null;

    // Find minimum weight crossing edge
    for (const u of inMST) {
      for (const { to, weight, edgeId } of adj.get(u)) {
        if (inMST.has(to)) continue;
        if (!bestEdge || weight < bestEdge.weight) {
          bestEdge = { u, v: to, weight, edgeId };
        }
      }
    }

    if (!bestEdge) break; // disconnected graph

    inMST.add(bestEdge.v);
    mstEdges.push(bestEdge);
    totalWeight += bestEdge.weight;
  }

  return mstEdges;
}`,
    complexity: {
      time: { best: "O(V²)", average: "O(V²)", worst: "O(V²)" },
      space: "O(V)",
    },
    stable: true,
    inPlace: false,
  },
  {
    id: "kruskal",
    name: "Kruskal's Algorithm",
    description:
      "A greedy algorithm that sorts all edges by weight and adds them one at a time to the MST, skipping any edge that would create a cycle. Uses Union-Find for cycle detection.",
    sourceCode: `class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x)
      this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(a: number, b: number): boolean {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb;
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;
    else { this.parent[rb] = ra; this.rank[ra]++; }
    return true;
  }
}

function kruskal(nodes: Node[], edges: Edge[]): Edge[] {
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(nodes.length);
  const mstEdges: Edge[] = [];

  for (const edge of sorted) {
    if (uf.union(edge.u, edge.v)) {
      mstEdges.push(edge);
      if (mstEdges.length === nodes.length - 1) break;
    }
  }

  return mstEdges;
}`,
    complexity: {
      time: { best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)" },
      space: "O(V)",
    },
    stable: true,
    inPlace: false,
  },
];

/* ── AI / ML Algorithms ─────────────────────────────────────────── */

const aiAlgorithms: Algorithm[] = [
  {
    id: "linear-regression",
    name: "Linear Regression",
    description:
      "Fits a straight line (y = mx + b) to data points by minimizing the mean squared error using gradient descent. The line iteratively adjusts its slope and intercept to best predict the relationship between variables.",
    sourceCode: `function linearRegression(points: Point[], lr: number) {
  let slope = 0, intercept = 0;
  const n = points.length;

  for (let epoch = 0; epoch < 200; epoch++) {
    let dSlope = 0, dIntercept = 0;

    for (const { x, y } of points) {
      const pred = slope * x + intercept;
      const error = pred - y;
      dSlope += error * x;
      dIntercept += error;
    }

    slope -= (lr * dSlope * 2) / n;
    intercept -= (lr * dIntercept * 2) / n;
  }

  return { slope, intercept };
}`,
    complexity: {
      time: { best: "O(n·k)", average: "O(n·k)", worst: "O(n·k)" },
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
  },
  {
    id: "knn",
    name: "K-Nearest Neighbors",
    description:
      "A non-parametric classification algorithm that assigns a class label to an unclassified point based on the majority vote of its k closest neighbors, measured by Euclidean distance.",
    sourceCode: `function knn(labeled: Point[], test: Point, k: number) {
  const distances = labeled.map((p, i) => ({
    index: i,
    dist: Math.hypot(p.x - test.x, p.y - test.y),
  }));

  distances.sort((a, b) => a.dist - b.dist);
  const neighbors = distances.slice(0, k);

  // Majority vote
  const votes: Record<number, number> = {};
  for (const { index } of neighbors) {
    const label = labeled[index].label;
    votes[label] = (votes[label] ?? 0) + 1;
  }

  return Object.entries(votes)
    .sort(([,a], [,b]) => b - a)[0][0];
}`,
    complexity: {
      time: { best: "O(n·d)", average: "O(n·d·log k)", worst: "O(n·d·log k)" },
      space: "O(n)",
    },
    stable: true,
    inPlace: false,
  },
  {
    id: "k-means",
    name: "K-Means Clustering",
    description:
      "An unsupervised clustering algorithm that partitions data into k clusters by iteratively assigning points to the nearest centroid and recalculating centroid positions until convergence.",
    sourceCode: `function kMeans(points: Point[], k: number) {
  // Initialize centroids from random data points
  let centroids = randomSample(points, k);
  let assignments = new Array(points.length).fill(0);

  for (let iter = 0; iter < 50; iter++) {
    // Assign to nearest centroid
    assignments = points.map(p => {
      let best = 0, bestDist = Infinity;
      centroids.forEach((c, i) => {
        const d = Math.hypot(p.x - c.x, p.y - c.y);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    });

    // Recalculate centroids
    let converged = true;
    centroids = centroids.map((c, i) => {
      const members = points.filter((_, j) => assignments[j] === i);
      if (!members.length) return c;
      const newC = {
        x: mean(members.map(m => m.x)),
        y: mean(members.map(m => m.y)),
      };
      if (Math.abs(c.x - newC.x) > 0.01) converged = false;
      return newC;
    });

    if (converged) break;
  }

  return { centroids, assignments };
}`,
    complexity: {
      time: { best: "O(n·k·d)", average: "O(n·k·d·i)", worst: "O(n·k·d·i)" },
      space: "O(n·k)",
    },
    stable: false,
    inPlace: false,
  },
  {
    id: "perceptron",
    name: "Perceptron",
    description:
      "A multi-layer perceptron (MLP) neural network trained via backpropagation. Each layer of neurons applies weighted sums and activation functions to inputs, learning the XOR function through iterative weight updates across training epochs.",
    sourceCode: `function* perceptron(network, params) {
  const { activationFunction, totalEpochs } = params;
  const trainingData = [[0,0,0],[0,1,1],[1,0,1],[1,1,0]];

  for (let epoch = 1; epoch <= totalEpochs; epoch++) {
    for (const [x1, x2, target] of trainingData) {
      // Forward pass
      const output = forward(network, [x1, x2]);
      // Backward pass (backpropagation)
      backward(network, [x1, x2], target);
      yield snapshot(network, epoch);
    }
  }
}`,
    complexity: {
      time: { best: "O(e*n*m)", average: "O(e*n*m)", worst: "O(e*n*m)" },
      space: "O(n*m)",
    },
    stable: true,
    inPlace: false,
  },
];

const gamesAlgorithms: Algorithm[] = [
  {
    id: "n-queen",
    name: "N-Queen Problem",
    description:
      "The N-Queen problem places N chess queens on an N×N board so that no two queens threaten each other. It uses backtracking to try placing one queen per row, pruning invalid positions early.",
    sourceCode: `function* nQueen(n: number) {
  const board = createBoard(n);
  const cols = new Set<number>();
  const diag1 = new Set<number>();  // row - col
  const diag2 = new Set<number>();  // row + col

  function* solve(row: number): Generator {
    if (row === n) return;
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col)
          || diag2.has(row + col)) continue;
      board[row][col].status = "placed";
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      yield snapshot();
      yield* solve(row + 1);
      // backtrack
      board[row][col].status = "empty";
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }
  yield* solve(0);
}`,
    complexity: {
      time: { best: "O(N!)", average: "O(N!)", worst: "O(N!)" },
      space: "O(N²)",
    },
    stable: false,
    inPlace: true,
  },
  {
    id: "sudoku",
    name: "Sudoku Solver",
    description:
      "Solves a Sudoku puzzle using constraint-satisfaction backtracking. It finds the next empty cell, tries digits 1–N, validates against row/column/box constraints, and backtracks on conflicts.",
    sourceCode: `function* sudoku(size: number) {
  const board = generatePuzzle(size);
  function isValid(r: number, c: number, num: number) {
    // check row, column, and box
    for (let i = 0; i < size; i++) {
      if (board[r][i].value === num) return false;
      if (board[i][c].value === num) return false;
    }
    const boxSize = Math.floor(Math.sqrt(size));
    const br = Math.floor(r / boxSize) * boxSize;
    const bc = Math.floor(c / boxSize) * boxSize;
    for (let i = br; i < br + boxSize; i++)
      for (let j = bc; j < bc + boxSize; j++)
        if (board[i][j].value === num) return false;
    return true;
  }
  function* solve(): Generator {
    const cell = findEmpty(board);
    if (!cell) return;
    const [r, c] = cell;
    for (let num = 1; num <= size; num++) {
      if (isValid(r, c, num)) {
        board[r][c].value = num;
        yield snapshot();
        yield* solve();
        board[r][c].value = 0;  // backtrack
      }
    }
  }
  yield* solve();
}`,
    complexity: {
      time: { best: "O(1)", average: "O(9^m)", worst: "O(9^m)" },
      space: "O(N²)",
    },
    stable: false,
    inPlace: true,
  },
  {
    id: "game-of-life",
    name: "Game of Life",
    description:
      "Conway's Game of Life is a cellular automaton where cells live or die based on neighbor count. A dead cell with exactly 3 neighbors becomes alive; a live cell with 2–3 neighbors survives; all others die.",
    sourceCode: `function* gameOfLife(size: number) {
  const rows = size;
  const cols = Math.round(size * 1.5);
  let grid = initRandomGrid(rows, cols);

  for (let gen = 0; gen < MAX_GEN; gen++) {
    const next = copyGrid(grid);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const n = countNeighbors(grid, r, c);
        const alive = grid[r][c].status === "alive";
        if (alive && (n < 2 || n > 3))
          next[r][c].status = "dead";
        else if (!alive && n === 3)
          next[r][c].status = "alive";
      }
    }
    grid = next;
    yield snapshot(gen, grid);
  }
}`,
    complexity: {
      time: { best: "O(G·R·C)", average: "O(G·R·C)", worst: "O(G·R·C)" },
      space: "O(R·C)",
    },
    stable: false,
    inPlace: false,
  },
  {
    id: "knight-tour",
    name: "Knight's Tour",
    description:
      "Finds a path for a knight to visit every square on an N×N chessboard exactly once. Uses Warnsdorff's heuristic — always move to the square with the fewest onward moves — with backtracking as fallback.",
    sourceCode: `function* knightTour(n: number) {
  const board = createBoard(n);
  const dx = [-2,-1,1,2, 2, 1,-1,-2];
  const dy = [ 1, 2,2,1,-1,-2,-2,-1];

  function* solve(r: number, c: number, move: number) {
    board[r][c] = { value: move, status: "path" };
    yield snapshot();
    if (move === n * n) return;
    const moves = getValidMoves(r, c)
      .sort((a, b) => degree(a) - degree(b));
    for (const [nr, nc] of moves) {
      yield* solve(nr, nc, move + 1);
      if (done) return;
      board[nr][nc] = { value: 0, status: "empty" };
    }
  }
  yield* solve(0, 0, 1);
}`,
    complexity: {
      time: { best: "O(N²)", average: "O(8^(N²))", worst: "O(8^(N²))" },
      space: "O(N²)",
    },
    stable: false,
    inPlace: true,
  },
  {
    id: "minimax",
    name: "Minimax (Alpha-Beta)",
    description:
      "The Minimax algorithm evaluates game trees to find optimal moves. Alpha-Beta pruning skips branches that cannot influence the final decision, dramatically reducing the search space.",
    sourceCode: `function* minimax(depth: number) {
  const tree = generateTree(depth, 3);
  function* evaluate(
    idx: number, isMax: boolean,
    alpha: number, beta: number
  ): Generator<number> {
    const node = tree[idx];
    node.status = "active";
    yield snapshot();
    if (node.children.length === 0) {
      node.status = "evaluated";
      return node.value!;
    }
    let best = isMax ? -Infinity : Infinity;
    for (const childId of node.children) {
      const val = yield* evaluate(
        childId, !isMax, alpha, beta
      );
      best = isMax ? Math.max(best, val) : Math.min(best, val);
      if (isMax) alpha = Math.max(alpha, best);
      else beta = Math.min(beta, best);
      if (alpha >= beta) { prune(remaining); break; }
    }
    node.value = best;
    node.status = "evaluated";
    yield snapshot();
    return best;
  }
  yield* evaluate(0, true, -Infinity, Infinity);
}`,
    complexity: {
      time: { best: "O(b^(d/2))", average: "O(b^(3d/4))", worst: "O(b^d)" },
      space: "O(b·d)",
    },
    stable: false,
    inPlace: true,
  },
];

const classicAlgorithms: Algorithm[] = [
  {
    id: "tower-of-hanoi",
    name: "Tower of Hanoi",
    description:
      "The Tower of Hanoi is a classic recursive puzzle. Move N discs from peg A to peg C using peg B as auxiliary, obeying the rule that no larger disc may sit atop a smaller one. The minimum solution requires 2^N − 1 moves.",
    sourceCode: `function* towerOfHanoi(n: number) {
  const pegs = [
    { name: "A", discs: [1..n] },
    { name: "B", discs: [] },
    { name: "C", discs: [] },
  ];

  function* move(
    count: number, from: number,
    to: number, aux: number
  ) {
    if (count === 0) return;
    yield* move(count - 1, from, aux, to);
    const disc = pegs[from].discs.shift()!;
    pegs[to].discs.unshift(disc);
    yield snapshot(pegs, disc.id, from, to);
    yield* move(count - 1, aux, to, from);
  }

  yield* move(n, 0, 2, 1);
}`,
    complexity: {
      time: { best: "O(2^n)", average: "O(2^n)", worst: "O(2^n)" },
      space: "O(n)",
    },
    stable: false,
    inPlace: true,
  },
];

export const categories: Category[] = [
  {
    id: "sorting",
    name: "Sorting",
    icon: ArrowUpDown,
    algorithms: sortingAlgorithms,
  },
  {
    id: "searching",
    name: "Searching",
    icon: Search,
    algorithms: searchingAlgorithms,
  },
  {
    id: "path-finding",
    name: "Path Finding",
    icon: Route,
    algorithms: pathFindingAlgorithms,
  },
  {
    id: "shortest-path",
    name: "Shortest Path",
    icon: Network,
    algorithms: shortestPathAlgorithms,
  },
  {
    id: "mst",
    name: "MST",
    icon: GitFork,
    algorithms: mstAlgorithms,
  },
  {
    id: "ai",
    name: "AI / ML",
    icon: Brain,
    algorithms: aiAlgorithms,
  },
  {
    id: "games",
    name: "Games",
    icon: Gamepad2,
    algorithms: gamesAlgorithms,
  },
  {
    id: "classic",
    name: "Classic",
    icon: Layers,
    algorithms: classicAlgorithms,
  },
];

export function findCategory(categoryId: string): Category | undefined {
  return categories.find((c) => c.id === categoryId);
}

export function findAlgorithm(
  categoryId: string,
  algoId: string,
): Algorithm | undefined {
  return findCategory(categoryId)?.algorithms.find((a) => a.id === algoId);
}
