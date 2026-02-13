import type { GridCell } from "@/lib/types/pathfinding";

export function createGrid(
  rows: number,
  cols: number,
  startNode: { row: number; col: number },
  endNode: { row: number; col: number },
): GridCell[][] {
  const grid: GridCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isWall: false,
        isStart: r === startNode.row && c === startNode.col,
        isEnd: r === endNode.row && c === endNode.col,
        isVisited: false,
        distance: Infinity,
        heuristic: Infinity,
        previousNode: null,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function cloneGrid(grid: GridCell[][]): GridCell[][] {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      isVisited: false,
      distance: Infinity,
      heuristic: Infinity,
      previousNode: null,
    })),
  );
}

export function getNeighbors(cell: GridCell, grid: GridCell[][]): GridCell[] {
  const { row, col } = cell;
  const neighbors: GridCell[] = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

export function reconstructPath(
  endCell: GridCell,
): { row: number; col: number }[] {
  const path: { row: number; col: number }[] = [];
  let current: GridCell | null = endCell;
  while (current !== null) {
    path.unshift({ row: current.row, col: current.col });
    current = current.previousNode;
  }
  return path;
}

export function manhattanDistance(
  a: { row: number; col: number },
  b: { row: number; col: number },
): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function countWalls(grid: GridCell[][]): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.isWall) count++;
    }
  }
  return count;
}

/** Recursive backtracking maze: starts with all walls, carves passages. */
export function generateMaze(
  baseGrid: GridCell[][],
  startNode: { row: number; col: number },
  endNode: { row: number; col: number },
): GridCell[][] {
  const grid = baseGrid.map((row) =>
    row.map((cell) => ({
      ...cell,
      isWall: true,
      isVisited: false,
      distance: Infinity,
      heuristic: Infinity,
      previousNode: null,
    })),
  );

  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  if (height < 3 || width < 3) {
    for (const row of grid) {
      for (const cell of row) cell.isWall = false;
    }
    ensureAccessible(grid, startNode);
    ensureAccessible(grid, endNode);
    return grid;
  }

  const visited = Array.from({ length: height }, () =>
    Array(width).fill(false),
  );

  // Start from a random odd cell
  const startRow = randomOdd(height);
  const startCol = randomOdd(width);
  visited[startRow][startCol] = true;
  grid[startRow][startCol].isWall = false;

  const stack = [{ row: startRow, col: startCol }];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getMazeNeighbors(
      current.row,
      current.col,
      visited,
      height,
      width,
    );

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    const betweenRow = current.row + (next.row - current.row) / 2;
    const betweenCol = current.col + (next.col - current.col) / 2;

    visited[next.row][next.col] = true;
    grid[next.row][next.col].isWall = false;
    grid[betweenRow][betweenCol].isWall = false;

    stack.push({ row: next.row, col: next.col });
  }

  ensureAccessible(grid, startNode);
  ensureAccessible(grid, endNode);

  return grid;
}

function randomOdd(limit: number): number {
  const candidates: number[] = [];
  for (let i = 1; i < limit - 1; i += 2) candidates.push(i);
  return candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : 0;
}

function getMazeNeighbors(
  row: number,
  col: number,
  visited: boolean[][],
  height: number,
  width: number,
): { row: number; col: number }[] {
  const deltas = [
    [2, 0],
    [-2, 0],
    [0, 2],
    [0, -2],
  ];
  const neighbors: { row: number; col: number }[] = [];
  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr > 0 && nr < height - 1 && nc > 0 && nc < width - 1 && !visited[nr][nc]) {
      neighbors.push({ row: nr, col: nc });
    }
  }
  return neighbors;
}

function ensureAccessible(
  grid: GridCell[][],
  node: { row: number; col: number },
): void {
  const { row, col } = node;
  if (!grid[row]?.[col]) return;
  grid[row][col].isWall = false;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const hasOpen = dirs.some(([dr, dc]) => {
    const nr = row + dr;
    const nc = col + dc;
    return nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && !grid[nr][nc].isWall;
  });

  if (!hasOpen) {
    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
        grid[nr][nc].isWall = false;
        break;
      }
    }
  }
}
