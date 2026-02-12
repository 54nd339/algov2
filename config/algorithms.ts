import {
  ArrowUpDown,
  Search,
  type LucideIcon,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Algorithm {
  /** URL slug, e.g. "bubble-sort" */
  id: string;
  /** Display name, e.g. "Bubble Sort" */
  name: string;
}

export interface Category {
  /** URL slug, e.g. "sorting" */
  id: string;
  /** Display name */
  name: string;
  /** Sidebar icon */
  icon: LucideIcon;
  /** Algorithms in this category */
  algorithms: Algorithm[];
}

// ── Registry ─────────────────────────────────────────────────────────────────
// Add new categories / algorithms here — sidebar, routing, and breadcrumbs
// are derived from this single source of truth.

export const categories: Category[] = [
  {
    id: "sorting",
    name: "Sorting",
    icon: ArrowUpDown,
    algorithms: [
      { id: "bubble-sort", name: "Bubble Sort" },
      { id: "insertion-sort", name: "Insertion Sort" },
      { id: "selection-sort", name: "Selection Sort" },
      { id: "merge-sort", name: "Merge Sort" },
      { id: "quick-sort", name: "Quick Sort" },
      { id: "heap-sort", name: "Heap Sort" },
      { id: "radix-sort", name: "Radix Sort" },
    ],
  },
  {
    id: "searching",
    name: "Searching",
    icon: Search,
    algorithms: [
      { id: "linear-search", name: "Linear Search" },
      { id: "binary-search", name: "Binary Search" },
      { id: "jump-search", name: "Jump Search" },
    ],
  },
];

// ── Lookup helpers ───────────────────────────────────────────────────────────

export function findCategory(categoryId: string): Category | undefined {
  return categories.find((c) => c.id === categoryId);
}

export function findAlgorithm(
  categoryId: string,
  algoId: string,
): Algorithm | undefined {
  return findCategory(categoryId)?.algorithms.find((a) => a.id === algoId);
}

/** First algorithm of a given category (used for default redirects). */
export function defaultAlgo(categoryId: string): Algorithm | undefined {
  return findCategory(categoryId)?.algorithms[0];
}
