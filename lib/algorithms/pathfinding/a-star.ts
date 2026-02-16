import type { GridCell, PathfindingSnapshot } from "@/lib/types";
import { getNeighbors, cellKey, manhattanDistance } from "./grid";
import { initPathfinding, stepSnapshot, foundSnapshot, noPathSnapshot } from "./shared";

export function* aStar(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
): Generator<PathfindingSnapshot> {
  const { startCell, endCell, visitedKeys, frontierKeys, makeStats } =
    initPathfinding(grid, start, end);

  startCell.distance = 0;
  startCell.heuristic = manhattanDistance(start, end);
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

    yield stepSnapshot(grid, current, visitedKeys, frontierKeys, makeStats);

    if (current.row === endCell.row && current.col === endCell.col) {
      yield foundSnapshot(grid, endCell, visitedKeys, makeStats);
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

  yield noPathSnapshot(grid, visitedKeys, makeStats);
}
