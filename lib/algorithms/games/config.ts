import type { BoardCell, GamesSnapshot } from "@/lib/types";

export const GAMES_SIZE_CONFIG: Record<string, { label: string; min: number; max: number; step: number }> = {
  "n-queen": { label: "N", min: 4, max: 12, step: 1 },
  "sudoku": { label: "Size", min: 4, max: 9, step: 5 },
  "game-of-life": { label: "Grid", min: 10, max: 40, step: 2 },
  "knight-tour": { label: "N", min: 5, max: 8, step: 1 },
  "minimax": { label: "Depth", min: 2, max: 5, step: 1 },
};

export const GAMES_VARIANT: Record<string, "queen" | "sudoku" | "life" | "knight"> = {
  "n-queen": "queen",
  "sudoku": "sudoku",
  "game-of-life": "life",
  "knight-tour": "knight",
};

/** Computes the Sudoku box dimension from the board size. */
export function sudokuBoxSize(algoId: string, boardSize: number): number | undefined {
  return algoId === "sudoku" ? Math.floor(Math.sqrt(boardSize)) : undefined;
}

/** Builds algorithm-specific options from current game state. */
export function buildGameOptions(
  algoId: string,
  gamesSnapshot: GamesSnapshot | null,
  branchingFactor: number,
): { initialBoard?: BoardCell[][]; startRow?: number; startCol?: number; branching?: number } {
  const options: { initialBoard?: BoardCell[][]; startRow?: number; startCol?: number; branching?: number } = {};
  if (algoId === "game-of-life" && gamesSnapshot?.type === "game-of-life") {
    options.initialBoard = gamesSnapshot.data.board;
  }
  if (algoId === "knight-tour" && gamesSnapshot?.type === "knight-tour") {
    options.startRow = gamesSnapshot.data.currentRow;
    options.startCol = gamesSnapshot.data.currentCol;
  }
  if (algoId === "minimax") {
    options.branching = branchingFactor;
  }
  return options;
}
