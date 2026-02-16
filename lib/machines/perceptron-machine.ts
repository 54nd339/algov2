import { assign, setup } from "xstate";
import type { PerceptronContext, PerceptronEvent, PerceptronSnapshot } from "@/lib/types";
import { visualizerStates } from "./visualizer-machine";

const DEFAULT_LAYERS = 3;
const DEFAULT_NEURONS = 5;

export function createPerceptronMachine() {
  return setup({
    types: {
      context: {} as PerceptronContext,
      events: {} as PerceptronEvent,
    },
  }).createMachine({
    id: "perceptron",
    initial: "idle",
    context: {
      speed: 5,
      stepIndex: 0,
      snapshot: null,
      layers: DEFAULT_LAYERS,
      neuronsPerLayer: DEFAULT_NEURONS,
      activationFunction: "relu",
      totalEpochs: 50,
    },
    on: {
      speedChange: {
        actions: assign({
          speed: ({ event }) => ("speed" in event ? event.speed : 5),
        }),
      },
      layersChange: {
        actions: assign(({ event }) => ({
          layers: "layers" in event ? event.layers : DEFAULT_LAYERS,
          stepIndex: 0,
          snapshot: null,
        })),
      },
      activationChange: {
        actions: assign({
          activationFunction: ({ event }) =>
            "fn" in event ? event.fn : ("relu" as const),
        }),
      },
      generate: {
        actions: assign(() => ({ stepIndex: 0, snapshot: null })),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- visualizerStates returns a generic shape; XState's createMachine types can't infer the concrete state config
    states: visualizerStates({
      onReset: () => ({ stepIndex: 0, snapshot: null }),
      onSnapshot: (event, ctx) => ({
        snapshot: "snapshot" in event ? (event.snapshot as PerceptronSnapshot) : null,
        stepIndex: ctx.stepIndex + 1,
      }),
      idleAcceptsSnapshot: true,
    }) as any,
  });
}
