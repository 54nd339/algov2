import type { GridCell, PathfindingSnapshot, PathfindingStats } from "@/lib/types/pathfinding";
import { getNeighbors, reconstructPath, cellKey, countWalls } from "./grid";

export function* dijkstra(
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
  const visitedKeys: string[] = [];
  const frontierKeys = new Set<string>();
  const unvisited: GridCell[] = [startCell];
  frontierKeys.add(cellKey(startCell.row, startCell.col));

  while (unvisited.length > 0) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift()!;
    const key = cellKey(closest.row, closest.col);
    frontierKeys.delete(key);

    if (closest.distance === Infinity) break;
    if (closest.isWall) continue;

    closest.isVisited = true;
    visitedKeys.push(key);

    yield {
      grid,
      currentCell: { row: closest.row, col: closest.col },
      visitedCells: [...visitedKeys],
      pathCells: [],
      frontierCells: [...frontierKeys],
      stats: makeStats(visitedKeys.length, 0),
    };

    if (closest.row === endCell.row && closest.col === endCell.col) {
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

    for (const neighbor of getNeighbors(closest, grid)) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const newDist = closest.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.previousNode = closest;
          const nKey = cellKey(neighbor.row, neighbor.col);
          if (!frontierKeys.has(nKey)) {
            frontierKeys.add(nKey);
            unvisited.push(neighbor);
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
