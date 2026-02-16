import type { CSSProperties } from "react";
import type { BoardCell, CellStatus } from "@/lib/types";
import { BOARD_CELL_SIZES } from "@/config";

/** Map cell status to CSS color variable. */
export const statusColors: Record<CellStatus, string> = {
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

/** Compute cell pixel size based on grid dimensions and game variant. */
export function getCellSize(rows: number, cols: number, variant: string): number {
  if (variant === "life") return BOARD_CELL_SIZES.life;
  if (variant === "sudoku") return BOARD_CELL_SIZES.sudoku;
  const maxDim = Math.max(rows, cols);
  if (maxDim <= 6) return BOARD_CELL_SIZES.small;
  if (maxDim <= 8) return BOARD_CELL_SIZES.medium;
  if (maxDim <= 12) return BOARD_CELL_SIZES.large;
  return BOARD_CELL_SIZES.xlarge;
}

/** Resolve the display character for a board cell. */
export function cellContent(cell: BoardCell, variant: string): string {
  switch (variant) {
    case "queen":
      return cell.value === 1 ? "♛" : "";
    case "sudoku":
    case "knight":
      return cell.value > 0 ? String(cell.value) : "";
    case "life":
      return cell.value === 1 ? "●" : "";
    default:
      return "";
  }
}

/** Build Sudoku thick-border style for box boundaries. */
export function sudokuBorderStyle(
  cell: BoardCell,
  boxSize: number,
  boardSize: number,
): CSSProperties {
  return {
    borderRight:
      (cell.col + 1) % boxSize === 0 && cell.col + 1 < boardSize
        ? "2px solid var(--foreground)"
        : undefined,
    borderBottom:
      (cell.row + 1) % boxSize === 0 && cell.row + 1 < boardSize
        ? "2px solid var(--foreground)"
        : undefined,
  };
}
