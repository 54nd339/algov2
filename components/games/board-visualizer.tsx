"use client";

import { memo, useCallback } from "react";
import type { BoardCell } from "@/lib/types";
import { statusColors, getCellSize, cellContent, sudokuBorderStyle } from "@/lib/algorithms/games";
import { ScrollArea } from "@/components/ui";
import { EmptyVisualizerState } from "@/components/common";

interface BoardVisualizerProps {
  board: BoardCell[][] | null;
  variant: "queen" | "sudoku" | "life" | "knight";
  boxSize?: number;
  onCellClick?: (row: number, col: number) => void;
}

export function BoardVisualizer({ board, variant, boxSize, onCellClick }: BoardVisualizerProps) {
  // Event-delegated click handler avoids per-cell closures
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onCellClick) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
      if (!el) return;
      const r = el.dataset.row;
      const c = el.dataset.col;
      if (r !== undefined && c !== undefined) onCellClick(Number(r), Number(c));
    },
    [onCellClick],
  );

  if (!board || board.length === 0) {
    return <EmptyVisualizerState />;
  }

  const rows = board.length;
  const cols = board[0].length;
  const size = getCellSize(rows, cols, variant);
  const isLife = variant === "life";

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex items-center justify-center p-4">
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
                gridTemplateColumns: `repeat(${cols}, ${size}px)`,
                gridTemplateRows: `repeat(${rows}, ${size}px)`,
              }
        }
        onClick={onCellClick ? handleClick : undefined}
      >
        {board.flat().map((cell) => (
          <BoardCellComponent
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            size={isLife ? undefined : size}
            variant={variant}
            boxSize={boxSize}
            boardSize={rows}
            clickable={!!onCellClick}
          />
        ))}
      </div>
      </div>
    </ScrollArea>
  );
}

const BoardCellComponent = memo(function BoardCellComponent({
  cell,
  size,
  variant,
  boxSize,
  boardSize,
  clickable,
}: {
  cell: BoardCell;
  size?: number;
  variant: string;
  boxSize?: number;
  boardSize: number;
  clickable: boolean;
}) {
  const bg = statusColors[cell.status] ?? "transparent";
  const isCheckerDark = (cell.row + cell.col) % 2 === 1;
  const checkerBg = isCheckerDark ? "var(--muted)" : "transparent";

  const extraBorder =
    variant === "sudoku" && boxSize
      ? sudokuBorderStyle(cell, boxSize, boardSize)
      : {};

  return (
    <div
      data-row={cell.row}
      data-col={cell.col}
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
        cursor: clickable ? "pointer" : undefined,
        ...extraBorder,
      }}
    >
      {cellContent(cell, variant)}
    </div>
  );
});
