import type { GridCell, PathfindingSnapshot } from "@/lib/types";
import { getNeighbors, cellKey } from "./grid";
import { initPathfinding, stepSnapshot, foundSnapshot, noPathSnapshot } from "./shared";

export function* dfs(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
): Generator<PathfindingSnapshot> {
  const { startCell, endCell, visitedKeys, frontierKeys, makeStats } =
    initPathfinding(grid, start, end);

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

    yield stepSnapshot(grid, node, visitedKeys, frontierKeys, makeStats);

    if (node.row === endCell.row && node.col === endCell.col) {
      yield foundSnapshot(grid, endCell, visitedKeys, makeStats);
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

  // Stack exhausted without reaching end — grid is unsolvable with current walls
  yield noPathSnapshot(grid, visitedKeys, makeStats);
}
