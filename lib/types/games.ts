export type CellStatus =
  | "empty"
  | "active"
  | "valid"
  | "invalid"
  | "placed"
  | "path"
  | "alive"
  | "dead"
  | "conflict";

export interface BoardCell {
  row: number;
  col: number;
  value: number;         // 0 = empty, or piece value
  status: CellStatus;
}

export interface NQueenStats {
  queensPlaced: number;
  backtracks: number;
  solutionsFound: number;
  timeElapsed: number;
}

export interface NQueenSnapshot {
  board: BoardCell[][];
  n: number;
  stats: NQueenStats;
}

export interface SudokuStats {
  cellsFilled: number;
  backtracks: number;
  totalCells: number;
  timeElapsed: number;
}

export interface SudokuSnapshot {
  board: BoardCell[][];
  size: number;
  stats: SudokuStats;
}

export interface LifeStats {
  generation: number;
  aliveCells: number;
  totalCells: number;
  timeElapsed: number;
}

export interface LifeSnapshot {
  board: BoardCell[][];
  rows: number;
  cols: number;
  stats: LifeStats;
}

export interface KnightStats {
  squaresVisited: number;
  backtracks: number;
  totalSquares: number;
  timeElapsed: number;
}

export interface KnightSnapshot {
  board: BoardCell[][];
  n: number;
  currentRow: number;
  currentCol: number;
  stats: KnightStats;
}

export interface MinimaxNode {
  id: string;
  value: number | null;
  isMax: boolean;
  children: string[];
  status: "idle" | "active" | "evaluated" | "pruned" | "selected";
  alpha?: number;
  beta?: number;
}

export interface MinimaxStats {
  nodesEvaluated: number;
  nodesPruned: number;
  treeDepth: number;
  timeElapsed: number;
}

export interface MinimaxSnapshot {
  nodes: MinimaxNode[];
  bestValue: number | null;
  stats: MinimaxStats;
}

export type GamesSnapshot =
  | { type: "n-queen"; data: NQueenSnapshot }
  | { type: "sudoku"; data: SudokuSnapshot }
  | { type: "game-of-life"; data: LifeSnapshot }
  | { type: "knight-tour"; data: KnightSnapshot }
  | { type: "minimax"; data: MinimaxSnapshot };

export interface GamesStats {
  primary: number;
  secondary: number;
  tertiary: number;
  timeElapsed: number;
}

export interface GamesContext {
  speed: number;
  stepIndex: number;
  snapshot: GamesSnapshot | null;
  stats: GamesStats;
  boardSize: number;
}

export type GamesEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "generate" }
  | { type: "speedChange"; speed: number }
  | { type: "boardSizeChange"; size: number }
  | { type: "updateSnapshot"; snapshot: GamesSnapshot };

export type GamesAlgorithmFn = (
  size: number,
  options?: { initialBoard?: BoardCell[][]; startRow?: number; startCol?: number; branching?: number },
) => Generator<GamesSnapshot>;
