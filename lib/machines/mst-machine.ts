import { assign, setup } from "xstate";
import type { MSTContext, MSTEvent, MSTSnapshot, MSTStats } from "@/lib/types/mst";
import { generateRandomGraph } from "@/lib/algorithms/shortest-path/graph-utils";

const DEFAULT_NODE_COUNT = 8;

function makeInitialGraph(count: number) {
  return generateRandomGraph(count);
}

const resetStats = (): MSTStats => ({
  edgesInMST: 0,
  totalWeight: 0,
  edgesChecked: 0,
  timeElapsed: 0,
});

export function createMSTMachine(algorithmId: string) {
  const initial = makeInitialGraph(DEFAULT_NODE_COUNT);

  return setup({
    types: {
      context: {} as MSTContext,
      events: {} as MSTEvent,
    },
  }).createMachine({
    id: `mst-${algorithmId}`,
    initial: "idle",
    context: {
      nodes: initial.nodes,
      edges: initial.edges,
      nodeCount: DEFAULT_NODE_COUNT,
      sourceNode: 0,
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
      nodeCountChange: {
        actions: assign(({ event }) => {
          const count = "count" in event ? event.count : DEFAULT_NODE_COUNT;
          const g = makeInitialGraph(count);
          return {
            nodeCount: count,
            nodes: g.nodes,
            edges: g.edges,
            sourceNode: 0,
            stats: resetStats(),
            stepIndex: 0,
            snapshot: null,
          };
        }),
      },
      generate: {
        actions: assign(({ context }) => {
          const g = makeInitialGraph(context.nodeCount);
          return {
            nodes: g.nodes,
            edges: g.edges,
            sourceNode: 0,
            stats: resetStats(),
            stepIndex: 0,
            snapshot: null,
          };
        }),
      },
      setSource: {
        actions: assign({
          sourceNode: ({ event }) => ("nodeId" in event ? event.nodeId : 0),
        }),
      },
    },
    states: {
      idle: {
        on: {
          play: "running",
          step: "stepping",
          reset: {
            actions: assign(({ context }) => {
              const g = makeInitialGraph(context.nodeCount);
              return {
                nodes: g.nodes,
                edges: g.edges,
                stats: resetStats(),
                stepIndex: 0,
                snapshot: null,
              };
            }),
          },
        },
      },
      running: {
        on: {
          pause: "paused",
          reset: {
            target: "idle",
            actions: assign(({ context }) => {
              const g = makeInitialGraph(context.nodeCount);
              return {
                nodes: g.nodes,
                edges: g.edges,
                stats: resetStats(),
                stepIndex: 0,
                snapshot: null,
              };
            }),
          },
          updateSnapshot: {
            actions: assign({
              snapshot: ({ event }) =>
                "snapshot" in event ? (event.snapshot as MSTSnapshot) : null,
              stats: ({ event, context }) =>
                "snapshot" in event && event.snapshot
                  ? (event.snapshot as MSTSnapshot).stats
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
            actions: assign(({ context }) => {
              const g = makeInitialGraph(context.nodeCount);
              return {
                nodes: g.nodes,
                edges: g.edges,
                stats: resetStats(),
                stepIndex: 0,
                snapshot: null,
              };
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
                "snapshot" in event ? (event.snapshot as MSTSnapshot) : null,
              stats: ({ event, context }) =>
                "snapshot" in event && event.snapshot
                  ? (event.snapshot as MSTSnapshot).stats
                  : context.stats,
              stepIndex: ({ context }) => context.stepIndex + 1,
            }),
          },
          play: "running",
          reset: {
            target: "idle",
            actions: assign(({ context }) => {
              const g = makeInitialGraph(context.nodeCount);
              return {
                nodes: g.nodes,
                edges: g.edges,
                stats: resetStats(),
                stepIndex: 0,
                snapshot: null,
              };
            }),
          },
        },
      },
      done: {
        on: {
          reset: {
            target: "idle",
            actions: assign(({ context }) => {
              const g = makeInitialGraph(context.nodeCount);
              return {
                nodes: g.nodes,
                edges: g.edges,
                stats: resetStats(),
                stepIndex: 0,
                snapshot: null,
              };
            }),
          },
          generate: {
            target: "idle",
            actions: assign(({ context }) => {
              const g = makeInitialGraph(context.nodeCount);
              return {
                nodes: g.nodes,
                edges: g.edges,
                stats: resetStats(),
                stepIndex: 0,
                snapshot: null,
              };
            }),
          },
        },
      },
    },
  });
}
