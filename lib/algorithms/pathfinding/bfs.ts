import type { GridCell, PathfindingSnapshot } from "@/lib/types";
import { getNeighbors, cellKey } from "./grid";
import { initPathfinding, stepSnapshot, foundSnapshot, noPathSnapshot } from "./shared";

export function* bfs(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
): Generator<PathfindingSnapshot> {
  const { startCell, endCell, visitedKeys, frontierKeys, makeStats } =
    initPathfinding(grid, start, end);

  const inQueue = new Set<string>();
  const queue: GridCell[] = [startCell];
  const startKey = cellKey(startCell.row, startCell.col);
  frontierKeys.add(startKey);
  inQueue.add(startKey);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const key = cellKey(node.row, node.col);
    frontierKeys.delete(key);

    if (node.isWall) continue;

    node.isVisited = true;
    visitedKeys.push(key);

    yield stepSnapshot(grid, node, visitedKeys, frontierKeys, makeStats);

    if (node.row === endCell.row && node.col === endCell.col) {
      yield foundSnapshot(grid, endCell, visitedKeys, makeStats);
      return;
    }

    for (const neighbor of getNeighbors(node, grid)) {
      const nKey = cellKey(neighbor.row, neighbor.col);
      if (!neighbor.isWall && !inQueue.has(nKey)) {
        neighbor.previousNode = node;
        inQueue.add(nKey);
        frontierKeys.add(nKey);
        queue.push(neighbor);
      }
    }
  }

  yield noPathSnapshot(grid, visitedKeys, makeStats);
}
