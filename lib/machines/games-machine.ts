import { assign, setup } from "xstate";
import type { GamesContext, GamesEvent, GamesSnapshot, GamesStats } from "@/lib/types";
import { visualizerStates } from "./visualizer-machine";

const DEFAULT_BOARD_SIZE: Record<string, number> = {
  "n-queen": 8,
  "sudoku": 9,
  "game-of-life": 20,
  "knight-tour": 6,
  "minimax": 3,
};

const resetStats = (): GamesStats => ({
  primary: 0,
  secondary: 0,
  tertiary: 0,
  timeElapsed: 0,
});

export function createGamesMachine(algorithmId: string) {
  const defaultSize = DEFAULT_BOARD_SIZE[algorithmId] ?? 8;

  return setup({
    types: { context: {} as GamesContext, events: {} as GamesEvent },
  }).createMachine({
    id: `games-${algorithmId}`,
    initial: "idle",
    context: {
      speed: 5,
      stepIndex: 0,
      snapshot: null,
      stats: resetStats(),
      boardSize: defaultSize,
    },
    on: {
      speedChange: {
        actions: assign({
          speed: ({ event }) => ("speed" in event ? event.speed : 5),
        }),
      },
      boardSizeChange: {
        actions: assign(({ event }) => ({
          boardSize: "size" in event ? event.size : defaultSize,
          stats: resetStats(),
          stepIndex: 0,
          snapshot: null,
        })),
      },
      generate: {
        actions: assign(() => ({ stats: resetStats(), stepIndex: 0, snapshot: null })),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- visualizerStates returns a generic shape; XState's createMachine types can't infer the concrete state config
    states: visualizerStates({
      onReset: () => ({ stats: resetStats(), stepIndex: 0, snapshot: null }),
      onSnapshot: (event, ctx) => ({
        snapshot: "snapshot" in event ? (event.snapshot as GamesSnapshot) : null,
        stepIndex: ctx.stepIndex + 1,
      }),
      idleAcceptsSnapshot: true,
    }) as any,
  });
}
