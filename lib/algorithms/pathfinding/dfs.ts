import type { GridCell, PathfindingSnapshot, PathfindingStats } from "@/lib/types/pathfinding";
import { getNeighbors, reconstructPath, cellKey, countWalls } from "./grid";

export function* dfs(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
): Generator<PathfindingSnapshot> {
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

  const visitedKeys: string[] = [];
  const frontierKeys = new Set<string>();
  const inStack = new Set<string>();
  const stack: GridCell[] = [startCell];
  const startKey = cellKey(startCell.row, startCell.col);
  frontierKeys.add(startKey);
  inStack.add(startKey);

  while (stack.length > 0) {
    const node = stack.pop()!;
    const key = cellKey(node.row, node.col);
    frontierKeys.delete(key);
    inStack.delete(key);

    if (node.isWall) continue;

    node.isVisited = true;
    visitedKeys.push(key);

    yield {
      grid,
      currentCell: { row: node.row, col: node.col },
      visitedCells: [...visitedKeys],
      pathCells: [],
      frontierCells: [...frontierKeys],
      stats: makeStats(visitedKeys.length, 0),
    };

    if (node.row === endCell.row && node.col === endCell.col) {
      const path = reconstructPath(endCell).map((p) => cellKey(p.row, p.col));
      yield {
        grid,
        visitedCells: [...visitedKeys],
        pathCells: path,
        frontierCells: [],
        stats: makeStats(visitedKeys.length, path.length),
      };
      return;
    }

    for (const neighbor of getNeighbors(node, grid)) {
      const nKey = cellKey(neighbor.row, neighbor.col);
      if (!neighbor.isWall && !inStack.has(nKey) && !neighbor.isVisited) {
        neighbor.previousNode = node;
        inStack.add(nKey);
        frontierKeys.add(nKey);
        stack.push(neighbor);
      }
    }
  }

  // No path found
  yield {
    grid,
    visitedCells: [...visitedKeys],
    pathCells: [],
    frontierCells: [],
    stats: makeStats(visitedKeys.length, 0),
  };
}
