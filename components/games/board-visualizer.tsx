"use client";

import type { BoardCell, CellStatus } from "@/lib/types/games";

/* ── Color mapping ─────────────────────────────────────────────── */

const statusColors: Record<CellStatus, string> = {
  empty: "transparent",
  active: "var(--algo-purple)",
  valid: "var(--algo-green)",
  invalid: "var(--algo-red)",
  placed: "var(--algo-cyan)",
  path: "var(--algo-yellow)",
  alive: "var(--algo-green)",
  dead: "transparent",
  conflict: "var(--algo-red)",
};

/* ── Main component ────────────────────────────────────────────── */

interface BoardVisualizerProps {
  board: BoardCell[][] | null;
  variant: "queen" | "sudoku" | "life" | "knight";
  boxSize?: number;
  onCellClick?: (row: number, col: number) => void;
}

export function BoardVisualizer({ board, variant, boxSize, onCellClick }: BoardVisualizerProps) {
  if (!board || board.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center font-space text-muted-foreground">
        Press Play to start
      </div>
    );
  }

  const rows = board.length;
  const cols = board[0].length;
  const cellSize = getCellSize(rows, cols, variant);
  const isLife = variant === "life";

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
      <div
        className="inline-grid border border-border"
        style={
          isLife
            ? {
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
                aspectRatio: `${cols} / ${rows}`,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridAutoRows: "1fr",
              }
            : {
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
              }
        }
      >
        {board.flat().map((cell) => (
          <BoardCellComponent
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            size={isLife ? undefined : cellSize}
            variant={variant}
            boxSize={boxSize}
            boardSize={rows}
            onCellClick={onCellClick}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Cell component ────────────────────────────────────────────── */

function BoardCellComponent({
  cell,
  size,
  variant,
  boxSize,
  boardSize,
  onCellClick,
}: {
  cell: BoardCell;
  size?: number;
  variant: string;
  boxSize?: number;
  boardSize: number;
  onCellClick?: (row: number, col: number) => void;
}) {
  const bg = statusColors[cell.status] ?? "transparent";
  const isCheckerDark = (cell.row + cell.col) % 2 === 1;
  const checkerBg = isCheckerDark ? "var(--muted)" : "transparent";

  // Sudoku: thick borders on box boundaries
  const sudokuBorder =
    variant === "sudoku" && boxSize
      ? {
          borderRight:
            (cell.col + 1) % boxSize === 0 && cell.col + 1 < boardSize
              ? "2px solid var(--foreground)"
              : undefined,
          borderBottom:
            (cell.row + 1) % boxSize === 0 && cell.row + 1 < boardSize
              ? "2px solid var(--foreground)"
              : undefined,
        }
      : {};

  return (
    <div
      className="flex items-center justify-center font-space text-xs font-bold transition-colors"
      style={{
        width: size,
        height: size,
        backgroundColor:
          cell.status !== "empty" && cell.status !== "dead"
            ? bg
            : checkerBg,
        color:
          cell.status !== "empty" && cell.status !== "dead"
            ? "var(--background)"
            : "var(--muted-foreground)",
        cursor: onCellClick ? "pointer" : undefined,
        ...sudokuBorder,
      }}
      onClick={onCellClick ? () => onCellClick(cell.row, cell.col) : undefined}
    >
      {renderContent(cell, variant)}
    </div>
  );
}

function renderContent(cell: BoardCell, variant: string): string {
  switch (variant) {
    case "queen":
      return cell.value === 1 ? "♛" : "";
    case "sudoku":
      return cell.value > 0 ? String(cell.value) : "";
    case "knight":
      return cell.value > 0 ? String(cell.value) : "";
    case "life":
      return cell.value === 1 ? "●" : "";
    default:
      return "";
  }
}

function getCellSize(rows: number, cols: number, variant: string): number {
  if (variant === "life") return 16;
  if (variant === "sudoku") return 40;
  const maxDim = Math.max(rows, cols);
  if (maxDim <= 6) return 56;
  if (maxDim <= 8) return 44;
  if (maxDim <= 12) return 36;
  return 28;
}

// Workaround to suppress TS unused warning — board is used via parent props
const board = null;
void board;
