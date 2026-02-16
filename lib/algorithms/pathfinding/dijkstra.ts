import type { GridCell, PathfindingSnapshot } from "@/lib/types";
import { getNeighbors, cellKey } from "./grid";
import { initPathfinding, stepSnapshot, foundSnapshot, noPathSnapshot } from "./shared";

export function* dijkstra(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
): Generator<PathfindingSnapshot> {
  const { startCell, endCell, visitedKeys, frontierKeys, makeStats } =
    initPathfinding(grid, start, end);

  startCell.distance = 0;
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

    yield stepSnapshot(grid, closest, visitedKeys, frontierKeys, makeStats);

    if (closest.row === endCell.row && closest.col === endCell.col) {
      yield foundSnapshot(grid, endCell, visitedKeys, makeStats);
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

  yield noPathSnapshot(grid, visitedKeys, makeStats);
}
