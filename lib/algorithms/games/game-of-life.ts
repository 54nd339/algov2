import type { BoardCell, GamesSnapshot, LifeStats } from "@/lib/types";

/* ── Conway's Game of Life ─────────────────────────────────────── */

export function* gameOfLife(
  size: number,
  options?: { initialBoard?: BoardCell[][] },
): Generator<GamesSnapshot> {
  const rows = size;
  const cols = Math.round(size * 1.5);
  const maxGenerations = 200;
  const startTime = performance.now();

  let board: BoardCell[][] = options?.initialBoard
    ? options.initialBoard.map((row) => row.map((c) => ({ ...c })))
    : Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const alive = Math.random() < 0.3;
          return {
            row: r,
            col: c,
            value: alive ? 1 : 0,
            status: alive ? ("alive" as const) : ("dead" as const),
          };
        }),
      );

  const snap = (gen: number): GamesSnapshot => {
    const aliveCells = board.flat().filter((c) => c.value === 1).length;
    const stats: LifeStats = {
      generation: gen,
      aliveCells,
      totalCells: rows * cols,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "game-of-life",
      data: {
        board: board.map((row) => row.map((c) => ({ ...c }))),
        rows,
        cols,
        stats,
      },
    };
  };

  yield snap(0);

  for (let gen = 1; gen <= maxGenerations; gen++) {
    const next: BoardCell[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        value: 0,
        status: "dead" as const,
      })),
    );

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const neighbors = countNeighbors(board, r, c, rows, cols);
        const alive = board[r][c].value === 1;

        if (alive && (neighbors === 2 || neighbors === 3)) {
          next[r][c].value = 1;
          next[r][c].status = "alive";
        } else if (!alive && neighbors === 3) {
          next[r][c].value = 1;
          next[r][c].status = "alive";
        } else {
          next[r][c].value = 0;
          next[r][c].status = "dead";
        }
      }
    }

    board = next;
    yield snap(gen);

    if (board.flat().every((c) => c.value === 0)) break;
  }
}

function countNeighbors(
  board: BoardCell[][],
  row: number,
  col: number,
  rows: number,
  cols: number,
): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      // Toroidal wrapping
      const r = (row + dr + rows) % rows;
      const c = (col + dc + cols) % cols;
      count += board[r][c].value;
    }
  }
  return count;
}
