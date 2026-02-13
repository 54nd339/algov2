import { assign, setup } from "xstate";
import type { ClassicContext, ClassicEvent, ClassicSnapshot } from "@/lib/types/classic";

export function createClassicMachine(algorithmId: string) {
  const defaultDiscs = algorithmId === "tower-of-hanoi" ? 4 : 4;

  return setup({
    types: {
      context: {} as ClassicContext,
      events: {} as ClassicEvent,
    },
  }).createMachine({
    id: `classic-${algorithmId}`,
    initial: "idle",
    context: {
      speed: 5,
      stepIndex: 0,
      snapshot: null,
      discCount: defaultDiscs,
    },
    on: {
      speedChange: {
        actions: assign({
          speed: ({ event }) => ("speed" in event ? event.speed : 5),
        }),
      },
      discCountChange: {
        actions: assign(({ event }) => ({
          discCount: "count" in event ? event.count : defaultDiscs,
          stepIndex: 0,
          snapshot: null,
        })),
      },
      generate: {
        actions: assign(() => ({
          stepIndex: 0,
          snapshot: null,
        })),
      },
    },
    states: {
      idle: {
        on: {
          play: "running",
          step: "stepping",
          reset: {
            actions: assign(() => ({
              stepIndex: 0,
              snapshot: null,
            })),
          },
          updateSnapshot: {
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event ? (event.snapshot as ClassicSnapshot) : null,
            }),
          },
        },
      },
      running: {
        on: {
          pause: "paused",
          reset: {
            target: "idle",
            actions: assign(() => ({
              stepIndex: 0,
              snapshot: null,
            })),
          },
          updateSnapshot: {
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event ? (event.snapshot as ClassicSnapshot) : null,
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
            actions: assign(() => ({
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
                "snapshot" in event ? (event.snapshot as ClassicSnapshot) : null,
              stepIndex: ({ context }) => context.stepIndex + 1,
            }),
          },
          play: "running",
          reset: {
            target: "idle",
            actions: assign(() => ({
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
            actions: assign(() => ({
              stepIndex: 0,
              snapshot: null,
            })),
          },
          generate: {
            target: "idle",
            actions: assign(() => ({
              stepIndex: 0,
              snapshot: null,
            })),
          },
        },
      },
    },
  });
}
