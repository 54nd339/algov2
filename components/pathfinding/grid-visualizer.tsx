"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { cellKey } from "@/lib/algorithms/pathfinding/grid";
import type { PathfindingSnapshot } from "@/lib/types/pathfinding";
import type { GridCell } from "@/lib/types/pathfinding";

interface GridVisualizerProps {
  grid: GridCell[][];
  snapshot: PathfindingSnapshot | null;
  cellSize?: number;
  onToggleWall: (row: number, col: number) => void;
  onSetStart: (row: number, col: number) => void;
  onSetEnd: (row: number, col: number) => void;
  disabled?: boolean;
}

export function GridVisualizer({
  grid,
  snapshot,
  cellSize = 24,
  onToggleWall,
  onSetStart,
  onSetEnd,
  disabled = false,
}: GridVisualizerProps) {
  const isDrawingRef = useRef(false);
  const modeRef = useRef<"wall" | "start" | "end">("wall");

  const visitedSet = new Set(snapshot?.visitedCells ?? []);
  const pathSet = new Set(snapshot?.pathCells ?? []);
  const frontierSet = new Set(snapshot?.frontierCells ?? []);
  const currentKey = snapshot?.currentCell
    ? cellKey(snapshot.currentCell.row, snapshot.currentCell.col)
    : null;

  const handlePointerDown = useCallback(
    (row: number, col: number, e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      isDrawingRef.current = true;

      const cell = grid[row]?.[col];
      if (!cell) return;

      if (cell.isStart) {
        modeRef.current = "start";
      } else if (cell.isEnd) {
        modeRef.current = "end";
      } else {
        modeRef.current = "wall";
        onToggleWall(row, col);
      }
    },
    [disabled, grid, onToggleWall],
  );

  const handlePointerEnter = useCallback(
    (row: number, col: number) => {
      if (!isDrawingRef.current || disabled) return;
      if (modeRef.current === "start") {
        onSetStart(row, col);
      } else if (modeRef.current === "end") {
        onSetEnd(row, col);
      } else {
        onToggleWall(row, col);
      }
    },
    [disabled, onToggleWall, onSetStart, onSetEnd],
  );

  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  return (
    <div
      className="h-full w-full overflow-auto"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="inline-grid select-none p-4"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 0}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
          gap: "1px",
        }}
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
                onPointerDown={(e) => handlePointerDown(r, c, e)}
                onPointerEnter={() => handlePointerEnter(r, c)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
