import { assign, setup } from "xstate";
import type {
  PathfindingContext,
  PathfindingEvent,
  PathfindingSnapshot,
  PathfindingStats,
} from "@/lib/types/pathfinding";
import { createGrid, generateMaze } from "@/lib/algorithms/pathfinding/grid";

const DEFAULT_ROWS = 21;
const DEFAULT_COLS = 41;
const DEFAULT_CELL_SIZE = 24;

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
      cellSize: DEFAULT_CELL_SIZE,
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
          const rows = e.rows;
          const cols = e.cols;
          const s = defaultStart(rows);
          const en = defaultEnd(rows, cols);
          return {
            rows,
            cols,
            startNode: s,
            endNode: en,
            grid: createGrid(rows, cols, s, en),
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
    states: {
      idle: {
        on: {
          play: "running",
          step: "stepping",
          reset: {
            actions: assign(({ context }) => ({
              grid: createGrid(context.rows, context.cols, context.startNode, context.endNode),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
          generateMaze: {
            actions: assign(({ context }) => {
              const base = createGrid(context.rows, context.cols, context.startNode, context.endNode);
              const maze = generateMaze(base, context.startNode, context.endNode);
              return { grid: maze, stats: resetStats(), stepIndex: 0, snapshot: null };
            }),
          },
          clearWalls: {
            actions: assign(({ context }) => ({
              grid: createGrid(context.rows, context.cols, context.startNode, context.endNode),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
        },
      },
      running: {
        on: {
          pause: "paused",
          reset: {
            target: "idle",
            actions: assign(({ context }) => ({
              grid: createGrid(context.rows, context.cols, context.startNode, context.endNode),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
          updateSnapshot: {
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event ? (event.snapshot as PathfindingSnapshot) : null,
              stats: ({ event, context }) =>
                "snapshot" in event && event.snapshot
                  ? (event.snapshot as PathfindingSnapshot).stats
                  : context.stats,
              stepIndex: ({ context }) => context.stepIndex + 1,
            }),
          },
          done: "done",
        },
      },
      paused: {
        on: {
          play: "running",
          step: "stepping",
          reset: {
            target: "idle",
            actions: assign(({ context }) => ({
              grid: createGrid(context.rows, context.cols, context.startNode, context.endNode),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
        },
      },
      stepping: {
        on: {
          updateSnapshot: {
            target: "paused",
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event ? (event.snapshot as PathfindingSnapshot) : null,
              stats: ({ event, context }) =>
                "snapshot" in event && event.snapshot
                  ? (event.snapshot as PathfindingSnapshot).stats
                  : context.stats,
              stepIndex: ({ context }) => context.stepIndex + 1,
            }),
          },
          play: "running",
          reset: {
            target: "idle",
            actions: assign(({ context }) => ({
              grid: createGrid(context.rows, context.cols, context.startNode, context.endNode),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
        },
      },
      done: {
        on: {
          reset: {
            target: "idle",
            actions: assign(({ context }) => ({
              grid: createGrid(context.rows, context.cols, context.startNode, context.endNode),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
          generateMaze: {
            target: "idle",
            actions: assign(({ context }) => {
              const base = createGrid(context.rows, context.cols, context.startNode, context.endNode);
              const maze = generateMaze(base, context.startNode, context.endNode);
              return { grid: maze, stats: resetStats(), stepIndex: 0, snapshot: null };
            }),
          },
          clearWalls: {
            target: "idle",
            actions: assign(({ context }) => ({
              grid: createGrid(context.rows, context.cols, context.startNode, context.endNode),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
        },
      },
    },
  });
}
