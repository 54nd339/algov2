import type { BoardCell, CellStatus, GamesSnapshot } from "@/lib/types";

/**
 * Toggle a cell in the Game of Life grid between alive/dead.
 * Returns the new snapshot to send to the state machine.
 */
export function toggleLifeCell(
  snapshot: GamesSnapshot & { type: "game-of-life" },
  row: number,
  col: number,
): GamesSnapshot {
  const newBoard = snapshot.data.board.map((r) => r.map((c) => ({ ...c })));
  const cell = newBoard[row][col];
  cell.value = cell.value === 1 ? 0 : 1;
  cell.status = cell.value === 1 ? "alive" : "dead";
  const aliveCells = newBoard.flat().filter((c) => c.value === 1).length;
  return {
    type: "game-of-life",
    data: {
      ...snapshot.data,
      board: newBoard,
      stats: { ...snapshot.data.stats, aliveCells },
    },
  };
}

/**
 * Set the knight's starting position on a fresh board.
 * Returns the new snapshot to send to the state machine.
 */
export function setKnightStart(
  snapshot: GamesSnapshot & { type: "knight-tour" },
  row: number,
  col: number,
): GamesSnapshot {
  const n = snapshot.data.board.length;
  const newBoard: BoardCell[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => ({
      row: r,
      col: c,
      value: 0,
      status: "empty" as CellStatus,
    })),
  );
  newBoard[row][col].value = 1;
  newBoard[row][col].status = "placed";
  return {
    type: "knight-tour",
    data: {
      ...snapshot.data,
      board: newBoard,
      currentRow: row,
      currentCol: col,
      stats: { ...snapshot.data.stats, squaresVisited: 1, backtracks: 0 },
    },
  };
}
