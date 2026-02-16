"use client";

import { useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { cellKey } from "@/lib/algorithms/pathfinding";
import { GRID_CELL_SIZE, GRID_GAP } from "@/config";
import type { PathfindingSnapshot, GridCell } from "@/lib/types";
import { ScrollArea } from "@/components/ui";

interface GridVisualizerProps {
  grid: GridCell[][];
  snapshot: PathfindingSnapshot | null;
  cellSize?: number;
  onToggleWall: (row: number, col: number) => void;
  onSetStart: (row: number, col: number) => void;
  onSetEnd: (row: number, col: number) => void;
  disabled?: boolean;
}

/** Reads data-row / data-col from the event target element. */
function cellFromEvent(e: React.PointerEvent): { row: number; col: number } | null {
  const el = e.target as HTMLElement;
  const r = el.dataset.row;
  const c = el.dataset.col;
  if (r === undefined || c === undefined) return null;
  return { row: Number(r), col: Number(c) };
}

export function GridVisualizer({
  grid,
  snapshot,
  cellSize = GRID_CELL_SIZE,
  onToggleWall,
  onSetStart,
  onSetEnd,
  disabled = false,
}: GridVisualizerProps) {
  const isDrawingRef = useRef(false);
  const modeRef = useRef<"wall" | "start" | "end">("wall");

  const visitedCells = snapshot?.visitedCells;
  const pathCells = snapshot?.pathCells;
  const frontierCells = snapshot?.frontierCells;
  const visitedSet = useMemo(() => new Set(visitedCells ?? []), [visitedCells]);
  const pathSet = useMemo(() => new Set(pathCells ?? []), [pathCells]);
  const frontierSet = useMemo(() => new Set(frontierCells ?? []), [frontierCells]);
  const currentKey = snapshot?.currentCell
    ? cellKey(snapshot.currentCell.row, snapshot.currentCell.col)
    : null;

  // Event-delegated pointer handlers avoid creating closures per cell
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      const pos = cellFromEvent(e);
      if (!pos) return;
      e.preventDefault();
      isDrawingRef.current = true;

      const cell = grid[pos.row]?.[pos.col];
      if (!cell) return;

      if (cell.isStart) {
        modeRef.current = "start";
      } else if (cell.isEnd) {
        modeRef.current = "end";
      } else {
        modeRef.current = "wall";
        onToggleWall(pos.row, pos.col);
      }
    },
    [disabled, grid, onToggleWall],
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawingRef.current || disabled) return;
      const pos = cellFromEvent(e);
      if (!pos) return;
      if (modeRef.current === "start") {
        onSetStart(pos.row, pos.col);
      } else if (modeRef.current === "end") {
        onSetEnd(pos.row, pos.col);
      } else {
        onToggleWall(pos.row, pos.col);
      }
    },
    [disabled, onToggleWall, onSetStart, onSetEnd],
  );

  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  return (
    <ScrollArea
      className="h-full w-full"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="inline-grid select-none p-4"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 0}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
          gap: GRID_GAP,
        }}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerEnter}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = cellKey(r, c);
            const isPath = pathSet.has(key);
            const isVisited = visitedSet.has(key);
            const isFrontier = frontierSet.has(key);
            const isCurrent = key === currentKey;

            return (
              <div
                key={key}
                data-row={r}
                data-col={c}
                className={cn(
                  "transition-colors duration-75",
                  cell.isStart && "bg-algo-green",
                  cell.isEnd && "bg-algo-red",
                  cell.isWall && !cell.isStart && !cell.isEnd && "bg-foreground/80 cell-wall",
                  !cell.isWall && !cell.isStart && !cell.isEnd && isPath && "bg-algo-yellow cell-path",
                  !cell.isWall && !cell.isStart && !cell.isEnd && isCurrent && !isPath && "bg-algo-purple",
                  !cell.isWall && !cell.isStart && !cell.isEnd && isFrontier && !isPath && !isCurrent && "bg-algo-cyan/50",
                  !cell.isWall && !cell.isStart && !cell.isEnd && isVisited && !isPath && !isCurrent && !isFrontier && "bg-algo-blue/40 cell-visited",
                  !cell.isWall && !cell.isStart && !cell.isEnd && !isVisited && !isPath && !isCurrent && !isFrontier && "bg-card",
                )}
                style={{ width: cellSize, height: cellSize }}
              />
            );
          }),
        )}
      </div>
    </ScrollArea>
  );
}
