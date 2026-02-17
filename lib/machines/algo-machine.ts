import { assign, setup } from "xstate";
import type { AlgoContext, AlgoEvent, AlgorithmSnapshot } from "@/lib/types";
import { visualizerStates } from "./visualizer-machine";

const generateArray = (size: number): number[] =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);

const INITIAL_SIZE = 30;

const resetStats = () => ({
  comparisons: 0,
  swaps: 0,
  accesses: 0,
  timeElapsed: 0,
});

export function createAlgoMachine(
  category: "sorting" | "searching",
  algorithmId: string,
  initialArray?: number[],
) {
  const startArray = initialArray ?? Array.from({ length: INITIAL_SIZE }, (_, i) => i + 1);

  const fullReset = (ctx: AlgoContext) => ({
    array: generateArray(ctx.array.length),
    stats: resetStats(),
    progress: 0,
    stepIndex: 0,
    snapshot: null,
  });

  /* Mid-play reset keeps the same array so users can re-run on identical data */
  const playReset = () => ({
    stats: resetStats(),
    progress: 0,
    stepIndex: 0,
    snapshot: null,
  });

  return setup({
    types: {
      context: {} as AlgoContext,
      events: {} as AlgoEvent,
    },
  }).createMachine({
    id: `${category}-${algorithmId}`,
    initial: "idle",
    context: {
      array: startArray,
      speed: 5,
      stepIndex: 0,
      snapshot: null,
      stats: resetStats(),
      progress: 0,
    },
    on: {
      speedChange: {
        actions: assign({
          speed: ({ event }) => ("speed" in event ? event.speed : 5),
        }),
      },
      sizeChange: {
        actions: assign({
          array: ({ event }) =>
            "size" in event ? generateArray(event.size) : generateArray(30),
          stats: () => resetStats(),
          progress: () => 0,
          stepIndex: () => 0,
          snapshot: () => null,
        }),
      },
      generate: {
        actions: assign({
          array: ({ context }) => generateArray(context.array.length),
          stats: () => resetStats(),
          progress: () => 0,
          stepIndex: () => 0,
          snapshot: () => null,
        }),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- visualizerStates returns a generic shape; XState's createMachine types can't infer the concrete state config
    states: visualizerStates({
      onReset: fullReset,
      onPlayReset: playReset,
      onSnapshot: (event, ctx) => ({
        snapshot: "snapshot" in event
          ? (event.snapshot as AlgorithmSnapshot)
          : null,
        stats: "snapshot" in event && event.snapshot
          ? (event.snapshot as AlgorithmSnapshot).stats
          : ctx.stats,
        stepIndex: ctx.stepIndex + 1,
      }),
    }) as any,
  });
}
