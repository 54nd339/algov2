import type { GridCell, PathfindingSnapshot, PathfindingStats } from "@/lib/types";
import { reconstructPath, cellKey, countWalls } from "./grid";

interface PathfindingSetup {
  startCell: GridCell;
  endCell: GridCell;
  walls: number;
  visitedKeys: string[];
  frontierKeys: Set<string>;
  makeStats: (explored: number, pathLen: number) => PathfindingStats;
}

/** Shared boilerplate extracted from all four pathfinding algorithms. */
export function initPathfinding(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
): PathfindingSetup {
  const startTime = performance.now();
  const startCell = grid[start.row][start.col];
  const endCell = grid[end.row][end.col];
  const walls = countWalls(grid);

  const makeStats = (explored: number, pathLen: number): PathfindingStats => ({
    cellsExplored: explored,
    pathLength: pathLen,
    wallCount: walls,
    timeElapsed: Math.round(performance.now() - startTime),
  });

  return { startCell, endCell, walls, visitedKeys: [], frontierKeys: new Set(), makeStats };
}

/** Yield the step snapshot emitted on each cell visit. */
export function stepSnapshot(
  grid: GridCell[][],
  node: GridCell,
  visitedKeys: string[],
  frontierKeys: Set<string>,
  makeStats: PathfindingSetup["makeStats"],
): PathfindingSnapshot {
  return {
    grid,
    currentCell: { row: node.row, col: node.col },
    visitedCells: [...visitedKeys],
    pathCells: [],
    frontierCells: [...frontierKeys],
    stats: makeStats(visitedKeys.length, 0),
  };
}

/** Yield the final snapshot when the goal is found. */
export function foundSnapshot(
  grid: GridCell[][],
  endCell: GridCell,
  visitedKeys: string[],
  makeStats: PathfindingSetup["makeStats"],
): PathfindingSnapshot {
  const path = reconstructPath(endCell).map((p) => cellKey(p.row, p.col));
  return {
    grid,
    visitedCells: [...visitedKeys],
    pathCells: path,
    frontierCells: [],
    stats: makeStats(visitedKeys.length, path.length),
  };
}

/** Yield the final snapshot when the grid is unsolvable. */
export function noPathSnapshot(
  grid: GridCell[][],
  visitedKeys: string[],
  makeStats: PathfindingSetup["makeStats"],
): PathfindingSnapshot {
  return {
    grid,
    visitedCells: [...visitedKeys],
    pathCells: [],
    frontierCells: [],
    stats: makeStats(visitedKeys.length, 0),
  };
}
