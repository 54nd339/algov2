import type { BoardCell, GamesSnapshot, SudokuStats } from "@/lib/types/games";

/* ── Sudoku Solver (Backtracking) ──────────────────────────────── */

export function* sudoku(size: number): Generator<GamesSnapshot> {
  // size must be a perfect square (4, 9, 16)
  const n = size;
  const boxSize = Math.round(Math.sqrt(n));

  // Generate a valid puzzle
  const board = generatePuzzle(n, boxSize);
  let backtracks = 0;
  const startTime = performance.now();

  const snap = (): GamesSnapshot => {
    const cellsFilled = board.flat().filter((c) => c.value > 0).length;
    const stats: SudokuStats = {
      cellsFilled,
      backtracks,
      totalCells: n * n,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "sudoku",
      data: {
        board: board.map((row) => row.map((c) => ({ ...c }))),
        size: n,
        stats,
      },
    };
  };

  yield snap();

  function* solve(): Generator<GamesSnapshot, boolean> {
    // Find next empty cell
    let emptyRow = -1;
    let emptyCol = -1;
    for (let r = 0; r < n && emptyRow === -1; r++) {
      for (let c = 0; c < n; c++) {
        if (board[r][c].value === 0) {
          emptyRow = r;
          emptyCol = c;
          break;
        }
      }
    }

    if (emptyRow === -1) return true; // solved

    board[emptyRow][emptyCol].status = "active";
    yield snap();

    for (let num = 1; num <= n; num++) {
      if (isValid(board, emptyRow, emptyCol, num, n, boxSize)) {
        board[emptyRow][emptyCol].value = num;
        board[emptyRow][emptyCol].status = "placed";
        yield snap();

        const solved: boolean = yield* solve();
        if (solved) return true;

        // Backtrack
        board[emptyRow][emptyCol].value = 0;
        board[emptyRow][emptyCol].status = "conflict";
        backtracks++;
        yield snap();
      }
    }

    board[emptyRow][emptyCol].status = "empty";
    return false;
  }

  yield* solve();
  // Mark all as valid when done
  for (const row of board) {
    for (const cell of row) {
      if (cell.value > 0) cell.status = "valid";
    }
  }
  yield snap();
}

function isValid(
  board: BoardCell[][],
  row: number,
  col: number,
  num: number,
  n: number,
  boxSize: number,
): boolean {
  // Check row
  for (let c = 0; c < n; c++) {
    if (board[row][c].value === num) return false;
  }
  // Check column
  for (let r = 0; r < n; r++) {
    if (board[r][col].value === num) return false;
  }
  // Check box
  const boxRowStart = Math.floor(row / boxSize) * boxSize;
  const boxColStart = Math.floor(col / boxSize) * boxSize;
  for (let r = boxRowStart; r < boxRowStart + boxSize; r++) {
    for (let c = boxColStart; c < boxColStart + boxSize; c++) {
      if (board[r][c].value === num) return false;
    }
  }
  return true;
}

function generatePuzzle(n: number, boxSize: number): BoardCell[][] {
  // Create empty board
  const board: BoardCell[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => ({
      row: r,
      col: c,
      value: 0,
      status: "empty" as const,
    })),
  );

  // Fill with a simple valid solution using shifting pattern
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      board[r][c].value =
        ((Math.floor(r / boxSize) + r * boxSize + c) % n) + 1;
    }
  }

  // Remove ~50% of cells to create the puzzle
  const cellsToRemove = Math.floor(n * n * 0.5);
  const indices = Array.from({ length: n * n }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < cellsToRemove; i++) {
    const r = Math.floor(indices[i] / n);
    const c = indices[i] % n;
    board[r][c].value = 0;
    board[r][c].status = "empty";
  }
  // Mark remaining cells as fixed (valid status)
  for (const row of board) {
    for (const cell of row) {
      if (cell.value > 0) cell.status = "valid";
    }
  }

  return board;
}
