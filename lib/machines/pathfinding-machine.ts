import { assign, setup } from "xstate";
import type { PathfindingContext, PathfindingEvent, PathfindingSnapshot, PathfindingStats } from "@/lib/types";
import { createGrid, generateMaze } from "@/lib/algorithms/pathfinding";
import { GRID_CELL_SIZE } from "@/config";
import { visualizerStates } from "./visualizer-machine";

const DEFAULT_ROWS = 21;
const DEFAULT_COLS = 41;

function defaultStart(rows: number) {
  return { row: Math.floor(rows / 2), col: 1 };
}

function defaultEnd(rows: number, cols: number) {
  return { row: Math.floor(rows / 2), col: cols - 2 };
}

const resetStats = (): PathfindingStats => ({
  cellsExplored: 0,
  pathLength: 0,
  wallCount: 0,
  timeElapsed: 0,
});

export function createPathfindingMachine(algorithmId: string) {
  const initialGrid = createGrid(
    DEFAULT_ROWS,
    DEFAULT_COLS,
    defaultStart(DEFAULT_ROWS),
    defaultEnd(DEFAULT_ROWS, DEFAULT_COLS),
  );

  const freshGrid = (ctx: any) => ({
    grid: createGrid(ctx.rows, ctx.cols, ctx.startNode, ctx.endNode),
    stats: resetStats(),
    stepIndex: 0,
    snapshot: null,
  });

  const mazeAction = (ctx: any) => {
    const base = createGrid(ctx.rows, ctx.cols, ctx.startNode, ctx.endNode);
    const maze = generateMaze(base, ctx.startNode, ctx.endNode);
    return { grid: maze, stats: resetStats(), stepIndex: 0, snapshot: null };
  };

  return setup({
    types: {
      context: {} as PathfindingContext,
      events: {} as PathfindingEvent,
    },
  }).createMachine({
    id: `pathfinding-${algorithmId}`,
    initial: "idle",
    context: {
      grid: initialGrid,
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
      cellSize: GRID_CELL_SIZE,
      startNode: defaultStart(DEFAULT_ROWS),
      endNode: defaultEnd(DEFAULT_ROWS, DEFAULT_COLS),
      speed: 5,
      stepIndex: 0,
      snapshot: null,
      stats: resetStats(),
    },
    on: {
      speedChange: {
        actions: assign({
          speed: ({ event }) => ("speed" in event ? event.speed : 5),
        }),
      },
      sizeChange: {
        actions: assign(({ event }) => {
          const e = event as { type: "sizeChange"; rows: number; cols: number };
          const s = defaultStart(e.rows);
          const en = defaultEnd(e.rows, e.cols);
          return {
            rows: e.rows,
            cols: e.cols,
            startNode: s,
            endNode: en,
            grid: createGrid(e.rows, e.cols, s, en),
            stats: resetStats(),
            stepIndex: 0,
            snapshot: null,
          };
        }),
      },
      toggleWall: {
        actions: assign({
          grid: ({ context, event }) => {
            const e = event as { type: "toggleWall"; row: number; col: number };
            const cell = context.grid[e.row]?.[e.col];
            if (!cell || cell.isStart || cell.isEnd) return context.grid;
            const next = context.grid.map((r) => r.map((c) => ({ ...c })));
            next[e.row][e.col].isWall = !next[e.row][e.col].isWall;
            return next;
          },
        }),
      },
      setStart: {
        actions: assign({
          startNode: ({ event }) => {
            const e = event as { type: "setStart"; row: number; col: number };
            return { row: e.row, col: e.col };
          },
          grid: ({ context, event }) => {
            const e = event as { type: "setStart"; row: number; col: number };
            const next = context.grid.map((r) => r.map((c) => ({ ...c, isStart: false })));
            next[e.row][e.col].isStart = true;
            next[e.row][e.col].isWall = false;
            return next;
          },
        }),
      },
      setEnd: {
        actions: assign({
          endNode: ({ event }) => {
            const e = event as { type: "setEnd"; row: number; col: number };
            return { row: e.row, col: e.col };
          },
          grid: ({ context, event }) => {
            const e = event as { type: "setEnd"; row: number; col: number };
            const next = context.grid.map((r) => r.map((c) => ({ ...c, isEnd: false })));
            next[e.row][e.col].isEnd = true;
            next[e.row][e.col].isWall = false;
            return next;
          },
        }),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- visualizerStates returns a generic shape; XState's createMachine types can't infer the concrete state config
    states: visualizerStates({
      onReset: freshGrid,
      onSnapshot: (event, ctx) => ({
        snapshot: "snapshot" in event ? (event.snapshot as PathfindingSnapshot) : null,
        stats: "snapshot" in event && event.snapshot
          ? (event.snapshot as PathfindingSnapshot).stats
          : ctx.stats,
        stepIndex: ctx.stepIndex + 1,
      }),
      extraIdleOn: {
        generateMaze: { actions: assign(({ context }: any) => mazeAction(context)) },
        clearWalls: { actions: assign(({ context }: any) => freshGrid(context)) },
      },
      extraDoneOn: {
        generateMaze: { target: "idle", actions: assign(({ context }: any) => mazeAction(context)) },
        clearWalls: { target: "idle", actions: assign(({ context }: any) => freshGrid(context)) },
      },
    }) as any,
  });
}
