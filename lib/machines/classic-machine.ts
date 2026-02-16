import { assign, setup } from "xstate";
import type { ClassicContext, ClassicEvent, ClassicSnapshot } from "@/lib/types";
import { visualizerStates } from "./visualizer-machine";

export function createClassicMachine(algorithmId: string) {
  const defaultDiscs = 4;

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
        actions: assign(() => ({ stepIndex: 0, snapshot: null })),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- visualizerStates returns a generic shape; XState's createMachine types can't infer the concrete state config
    states: visualizerStates({
      onReset: () => ({ stepIndex: 0, snapshot: null }),
      onSnapshot: (event, ctx) => ({
        snapshot: "snapshot" in event ? (event.snapshot as ClassicSnapshot) : null,
        stepIndex: ctx.stepIndex + 1,
      }),
      idleAcceptsSnapshot: true,
    }) as any,
  });
}
