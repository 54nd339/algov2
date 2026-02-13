import { assign, setup } from "xstate";
import type { AIContext, AIEvent, AISnapshot, AIStats } from "@/lib/types/ai";
import {
  generateRegressionData,
  generateClassificationData,
  generateClusterData,
} from "@/lib/algorithms/ai/data-utils";

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
  const initialK = algorithmId === "k-means" ? 3 : 3;
  const initialData = makeInitialData(algorithmId, DEFAULT_POINT_COUNT, initialK);

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
            snapshot: null,
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
            snapshot: null,
          };
        }),
      },
      learningRateChange: {
        actions: assign({
          learningRate: ({ event }) => ("rate" in event ? event.rate : 0.01),
        }),
      },
      generate: {
        actions: assign(({ context }) => ({
          dataPoints: makeInitialData(algorithmId, context.pointCount, context.k),
          stats: resetStats(),
          stepIndex: 0,
          snapshot: null,
        })),
      },
      setPoints: {
        actions: assign(({ event }) => ({
          dataPoints: "points" in event ? event.points : [],
          pointCount: "points" in event ? event.points.length : 0,
          stats: resetStats(),
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
            actions: assign(({ context }) => ({
              dataPoints: makeInitialData(algorithmId, context.pointCount, context.k),
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
              dataPoints: makeInitialData(algorithmId, context.pointCount, context.k),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
          updateSnapshot: {
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event ? (event.snapshot as AISnapshot) : null,
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
              dataPoints: makeInitialData(algorithmId, context.pointCount, context.k),
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
                "snapshot" in event ? (event.snapshot as AISnapshot) : null,
              stepIndex: ({ context }) => context.stepIndex + 1,
            }),
          },
          play: "running",
          reset: {
            target: "idle",
            actions: assign(({ context }) => ({
              dataPoints: makeInitialData(algorithmId, context.pointCount, context.k),
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
              dataPoints: makeInitialData(algorithmId, context.pointCount, context.k),
              stats: resetStats(),
              stepIndex: 0,
              snapshot: null,
            })),
          },
          generate: {
            target: "idle",
            actions: assign(({ context }) => ({
              dataPoints: makeInitialData(algorithmId, context.pointCount, context.k),
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
