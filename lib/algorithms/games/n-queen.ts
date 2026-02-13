import type { BoardCell, GamesSnapshot, NQueenStats } from "@/lib/types/games";

/* ── N-Queen Problem (Backtracking) ────────────────────────────── */

export function* nQueen(n: number): Generator<GamesSnapshot> {
  const board: BoardCell[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => ({
      row: r,
      col: c,
      value: 0,
      status: "empty" as const,
    })),
  );

  let backtracks = 0;
  let solutionsFound = 0;
  const startTime = performance.now();

  const colSet = new Set<number>();
  const diag1 = new Set<number>(); // row - col
  const diag2 = new Set<number>(); // row + col

  const snap = (): GamesSnapshot => {
    const queensPlaced = board.flat().filter((c) => c.value === 1).length;
    const stats: NQueenStats = {
      queensPlaced,
      backtracks,
      solutionsFound,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "n-queen",
      data: {
        board: board.map((row) => row.map((c) => ({ ...c }))),
        n,
        stats,
      },
    };
  };

  yield snap();

  function* solve(row: number): Generator<GamesSnapshot> {
    if (row === n) {
      solutionsFound++;
      yield snap();
      return;
    }

    for (let col = 0; col < n; col++) {
      board[row][col].status = "active";
      yield snap();

      if (!colSet.has(col) && !diag1.has(row - col) && !diag2.has(row + col)) {
        // Place queen
        board[row][col].value = 1;
        board[row][col].status = "placed";
        colSet.add(col);
        diag1.add(row - col);
        diag2.add(row + col);

        // Mark conflicts
        markThreats(board, row, col, n);
        yield snap();

        yield* solve(row + 1);

        // If we only want first solution, uncomment:
        if (solutionsFound > 0) return;

        // Remove queen (backtrack)
        board[row][col].value = 0;
        board[row][col].status = "empty";
        colSet.delete(col);
        diag1.delete(row - col);
        diag2.delete(row + col);
        backtracks++;

        clearThreats(board, n);
        yield snap();
      } else {
        board[row][col].status = "conflict";
        yield snap();
        board[row][col].status = "empty";
      }
    }
  }

  yield* solve(0);
  yield snap();
}

function markThreats(board: BoardCell[][], qRow: number, qCol: number, n: number) {
  // Reset non-queen cells first
  for (const row of board) {
    for (const cell of row) {
      if (cell.value !== 1 && cell.status !== "active") cell.status = "empty";
    }
  }
  // Mark threatened cells
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c].value === 1) continue;
      // Check all placed queens
      for (const row of board) {
        for (const cell of row) {
          if (cell.value !== 1) continue;
          if (
            cell.row === r ||
            cell.col === c ||
            Math.abs(cell.row - r) === Math.abs(cell.col - c)
          ) {
            board[r][c].status = "invalid";
          }
        }
      }
    }
  }
}

function clearThreats(board: BoardCell[][], n: number) {
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c].value !== 1) board[r][c].status = "empty";
    }
  }
  // Re-mark from remaining queens
  for (const row of board) {
    for (const cell of row) {
      if (cell.value === 1) markThreats(board, cell.row, cell.col, n);
    }
  }
}
