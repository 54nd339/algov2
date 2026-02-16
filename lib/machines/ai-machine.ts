import { assign, setup } from "xstate";
import type { AIContext, AIEvent, AISnapshot, AIStats } from "@/lib/types";
import {
  generateRegressionData,
  generateClassificationData,
  generateClusterData,
} from "@/lib/algorithms/ai";
import { visualizerStates } from "./visualizer-machine";

const DEFAULT_POINT_COUNT = 40;

function makeInitialData(algoId: string, count: number, k: number) {
  switch (algoId) {
    case "linear-regression":
      return generateRegressionData(count);
    case "knn":
      return generateClassificationData(count, k);
    case "k-means":
      return generateClusterData(count, k);
    default:
      return generateRegressionData(count);
  }
}

const resetStats = (): AIStats => ({
  primaryMetric: 0,
  secondaryMetric: 0,
  iterations: 0,
  timeElapsed: 0,
});

export function createAIMachine(algorithmId: string) {
  const initialK = 3;
  const initialData = makeInitialData(algorithmId, DEFAULT_POINT_COUNT, initialK);

  const regenerate = (ctx: any) => ({
    dataPoints: makeInitialData(algorithmId, ctx.pointCount, ctx.k),
    stats: resetStats(),
    stepIndex: 0,
    snapshot: null as AISnapshot | null,
  });

  return setup({
    types: {
      context: {} as AIContext,
      events: {} as AIEvent,
    },
  }).createMachine({
    id: `ai-${algorithmId}`,
    initial: "idle",
    context: {
      dataPoints: initialData,
      pointCount: DEFAULT_POINT_COUNT,
      speed: 5,
      stepIndex: 0,
      snapshot: null,
      stats: resetStats(),
      k: initialK,
      learningRate: algorithmId === "linear-regression" ? 0.0001 : 0.1,
    },
    on: {
      speedChange: {
        actions: assign({
          speed: ({ event }) => ("speed" in event ? event.speed : 5),
        }),
      },
      pointCountChange: {
        actions: assign(({ event, context }) => {
          const count = "count" in event ? event.count : DEFAULT_POINT_COUNT;
          return {
            pointCount: count,
            dataPoints: makeInitialData(algorithmId, count, context.k),
            stats: resetStats(),
            stepIndex: 0,
            snapshot: null as AISnapshot | null,
          };
        }),
      },
      kChange: {
        actions: assign(({ event, context }) => {
          const k = "k" in event ? event.k : 3;
          return {
            k,
            dataPoints: makeInitialData(algorithmId, context.pointCount, k),
            stats: resetStats(),
            stepIndex: 0,
            snapshot: null as AISnapshot | null,
          };
        }),
      },
      learningRateChange: {
        actions: assign({
          learningRate: ({ event }) => ("rate" in event ? event.rate : 0.01),
        }),
      },
      generate: {
        actions: assign(({ context }: any) => regenerate(context)),
      },
      setPoints: {
        actions: assign(({ event }) => ({
          dataPoints: "points" in event ? event.points : [],
          pointCount: "points" in event ? event.points.length : 0,
          stats: resetStats(),
          stepIndex: 0,
          snapshot: null as AISnapshot | null,
        })),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- visualizerStates returns a generic shape; XState's createMachine types can't infer the concrete state config
    states: visualizerStates({
      onReset: regenerate,
      onSnapshot: (event, ctx) => ({
        snapshot: "snapshot" in event ? (event.snapshot as AISnapshot) : null,
        stepIndex: ctx.stepIndex + 1,
      }),
    }) as any,
  });
}
