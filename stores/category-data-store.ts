import { create } from "zustand";
import type { GridCell, GraphNode, GraphEdge } from "@/lib/types";

interface PathfindingData {
  grid: GridCell[][];
  rows: number;
  cols: number;
  startNode: { row: number; col: number };
  endNode: { row: number; col: number };
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCount: number;
}

interface CategoryDataState {
  sortingArray: number[] | null;
  searchingArray: number[] | null;
  pathfindingData: PathfindingData | null;
  graphData: GraphData | null;
  mstData: GraphData | null;
}

interface CategoryDataActions {
  setSortingArray: (array: number[]) => void;
  setSearchingArray: (array: number[]) => void;
  setPathfindingData: (data: PathfindingData) => void;
  setGraphData: (data: GraphData) => void;
  setMstData: (data: GraphData) => void;
  clearCategory: (category: string) => void;
}

export const useCategoryDataStore = create<CategoryDataState & CategoryDataActions>((set) => ({
  sortingArray: null,
  searchingArray: null,
  pathfindingData: null,
  graphData: null,
  mstData: null,

  setSortingArray: (array) => set({ sortingArray: array }),
  setSearchingArray: (array) => set({ searchingArray: array }),
  setPathfindingData: (data) => set({ pathfindingData: data }),
  setGraphData: (data) => set({ graphData: data }),
  setMstData: (data) => set({ mstData: data }),

  clearCategory: (category) => {
    const cleared: Partial<CategoryDataState> = {};
    if (category === "sorting") cleared.sortingArray = null;
    if (category === "searching") cleared.searchingArray = null;
    if (category === "path-finding") cleared.pathfindingData = null;
    if (category === "shortest-path") cleared.graphData = null;
    if (category === "mst") cleared.mstData = null;
    set(cleared);
  },
}));
