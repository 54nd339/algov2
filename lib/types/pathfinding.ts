export interface GridCell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  distance: number;
  heuristic: number;
  previousNode: GridCell | null;
}

export interface PathfindingStats {
  cellsExplored: number;
  pathLength: number;
  wallCount: number;
  timeElapsed: number;
}

export interface PathfindingSnapshot {
  grid: GridCell[][];
  currentCell?: { row: number; col: number };
  visitedCells: string[];
  pathCells: string[];
  frontierCells: string[];
  stats: PathfindingStats;
}

export interface PathfindingContext {
  grid: GridCell[][];
  rows: number;
  cols: number;
  cellSize: number;
  startNode: { row: number; col: number };
  endNode: { row: number; col: number };
  speed: number;
  stepIndex: number;
  snapshot: PathfindingSnapshot | null;
  stats: PathfindingStats;
}

export type PathfindingEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "generateMaze" }
  | { type: "clearWalls" }
  | { type: "speedChange"; speed: number }
  | { type: "sizeChange"; rows: number; cols: number }
  | { type: "toggleWall"; row: number; col: number }
  | { type: "setStart"; row: number; col: number }
  | { type: "setEnd"; row: number; col: number }
  | { type: "updateSnapshot"; snapshot: PathfindingSnapshot };

export type PathfindingAlgorithmFn = (
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
) => Generator<PathfindingSnapshot>;
