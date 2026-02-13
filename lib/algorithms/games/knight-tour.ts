import type { BoardCell, GamesSnapshot, KnightStats } from "@/lib/types/games";

/* ── Knight's Tour (Warnsdorff's Heuristic) ────────────────────── */

const MOVES = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];

export function* knightTour(
  n: number,
  options?: { startRow?: number; startCol?: number },
): Generator<GamesSnapshot> {
  const board: BoardCell[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => ({
      row: r,
      col: c,
      value: 0,
      status: "empty" as const,
    })),
  );

  const startRow = options?.startRow ?? 0;
  const startCol = options?.startCol ?? 0;
  let backtracks = 0;
  let squaresVisited = 0;
  const startTime = performance.now();

  const snap = (): GamesSnapshot => {
    const stats: KnightStats = {
      squaresVisited,
      backtracks,
      totalSquares: n * n,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "knight-tour",
      data: {
        board: board.map((row) => row.map((c) => ({ ...c }))),
        n,
        currentRow: 0,
        currentCol: 0,
        stats,
      },
    };
  };

  // Start from chosen position
  board[startRow][startCol].value = 1;
  board[startRow][startCol].status = "placed";
  squaresVisited = 1;
  yield snap();

  function* solve(row: number, col: number, moveNum: number): Generator<GamesSnapshot, boolean> {
    if (moveNum > n * n) return true;

    // Get valid moves sorted by Warnsdorff degree (fewest onward moves first)
    const validMoves = MOVES
      .map(([dr, dc]) => ({ r: row + dr, c: col + dc }))
      .filter(
        ({ r, c }) => r >= 0 && r < n && c >= 0 && c < n && board[r][c].value === 0,
      )
      .map(({ r, c }) => ({
        r,
        c,
        degree: MOVES.filter(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          return nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc].value === 0;
        }).length,
      }))
      .sort((a, b) => a.degree - b.degree);

    for (const move of validMoves) {
      board[move.r][move.c].value = moveNum;
      board[move.r][move.c].status = "active";
      squaresVisited++;
      yield snap();

      board[move.r][move.c].status = "path";
      const solved: boolean = yield* solve(move.r, move.c, moveNum + 1);
      if (solved) return true;

      // Backtrack
      board[move.r][move.c].value = 0;
      board[move.r][move.c].status = "empty";
      squaresVisited--;
      backtracks++;
      yield snap();
    }

    return false;
  }

  yield* solve(startRow, startCol, 2);

  // Mark all as placed when done
  for (const row of board) {
    for (const cell of row) {
      if (cell.value > 0) cell.status = "placed";
    }
  }
  yield snap();
}
