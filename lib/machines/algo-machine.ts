import { assign, setup } from "xstate";
import type { AlgoContext, AlgoEvent, AlgorithmSnapshot } from "@/lib/types/algorithms";

const generateArray = (size: number): number[] =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);

const INITIAL_ARRAY = Array.from({ length: 30 }, (_, i) => i + 1);

const resetStats = () => ({
  comparisons: 0,
  swaps: 0,
  accesses: 0,
  timeElapsed: 0,
});

export function createAlgoMachine(
  category: "sorting" | "searching",
  algorithmId: string,
) {
  return setup({
    types: {
      context: {} as AlgoContext,
      events: {} as AlgoEvent,
    },
  }).createMachine({
    id: `${category}-${algorithmId}`,
    initial: "idle",
    context: {
      array: INITIAL_ARRAY,
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
    states: {
      idle: {
        on: {
          play: "running",
          step: "stepping",
          reset: {
            actions: assign({
              array: ({ context }) => generateArray(context.array.length),
              stats: () => resetStats(),
              progress: () => 0,
              stepIndex: () => 0,
              snapshot: () => null,
            }),
          },
        },
      },
      running: {
        on: {
          pause: "paused",
          reset: {
            target: "idle",
            actions: assign({
              stats: () => resetStats(),
              progress: () => 0,
              stepIndex: () => 0,
              snapshot: () => null,
            }),
          },
          updateSnapshot: {
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event
                  ? (event.snapshot as AlgorithmSnapshot)
                  : null,
              stats: ({ event, context }) =>
                "snapshot" in event && event.snapshot
                  ? (event.snapshot as AlgorithmSnapshot).stats
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
            actions: assign({
              stats: () => resetStats(),
              progress: () => 0,
              stepIndex: () => 0,
              snapshot: () => null,
            }),
          },
        },
      },
      stepping: {
        on: {
          updateSnapshot: {
            target: "paused",
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event
                  ? (event.snapshot as AlgorithmSnapshot)
                  : null,
              stats: ({ event, context }) =>
                "snapshot" in event && event.snapshot
                  ? (event.snapshot as AlgorithmSnapshot).stats
                  : context.stats,
              stepIndex: ({ context }) => context.stepIndex + 1,
            }),
          },
          play: "running",
          reset: {
            target: "idle",
            actions: assign({
              stats: () => resetStats(),
              progress: () => 0,
              stepIndex: () => 0,
              snapshot: () => null,
            }),
          },
        },
      },
      done: {
        on: {
          reset: {
            target: "idle",
            actions: assign({
              array: ({ context }) => generateArray(context.array.length),
              stats: () => resetStats(),
              progress: () => 0,
              stepIndex: () => 0,
              snapshot: () => null,
            }),
          },
          generate: {
            target: "idle",
            actions: assign({
              array: ({ context }) => generateArray(context.array.length),
              stats: () => resetStats(),
              progress: () => 0,
              stepIndex: () => 0,
              snapshot: () => null,
            }),
          },
        },
      },
    },
  });
}
