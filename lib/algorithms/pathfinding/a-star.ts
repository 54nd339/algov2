import type { GridCell, PathfindingSnapshot, PathfindingStats } from "@/lib/types/pathfinding";
import { getNeighbors, reconstructPath, cellKey, countWalls, manhattanDistance } from "./grid";

export function* aStar(
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

  startCell.distance = 0;
  startCell.heuristic = manhattanDistance(start, end);
  const visitedKeys: string[] = [];
  const frontierKeys = new Set<string>();
  const open: GridCell[] = [startCell];
  frontierKeys.add(cellKey(startCell.row, startCell.col));

  while (open.length > 0) {
    open.sort(
      (a, b) => a.distance + a.heuristic - (b.distance + b.heuristic),
    );
    const current = open.shift()!;
    const key = cellKey(current.row, current.col);
    frontierKeys.delete(key);

    if (current.isWall) continue;

    current.isVisited = true;
    visitedKeys.push(key);

    yield {
      grid,
      currentCell: { row: current.row, col: current.col },
      visitedCells: [...visitedKeys],
      pathCells: [],
      frontierCells: [...frontierKeys],
      stats: makeStats(visitedKeys.length, 0),
    };

    if (current.row === endCell.row && current.col === endCell.col) {
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

    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const newDist = current.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.heuristic = manhattanDistance(
            { row: neighbor.row, col: neighbor.col },
            end,
          );
          neighbor.previousNode = current;
          const nKey = cellKey(neighbor.row, neighbor.col);
          if (!frontierKeys.has(nKey)) {
            frontierKeys.add(nKey);
            open.push(neighbor);
          }
        }
      }
    }
  }

  yield {
    grid,
    visitedCells: [...visitedKeys],
    pathCells: [],
    frontierCells: [],
    stats: makeStats(visitedKeys.length, 0),
  };
}
