import { assign, setup } from "xstate";
import type { MSTContext, MSTEvent, MSTSnapshot, MSTStats, GraphNode, GraphEdge } from "@/lib/types";
import { generateRandomGraph } from "@/lib/algorithms/shortest-path";
import { visualizerStates } from "./visualizer-machine";

const DEFAULT_NODE_COUNT = 8;

const resetStats = (): MSTStats => ({
  edgesInMST: 0,
  totalWeight: 0,
  edgesChecked: 0,
  timeElapsed: 0,
});

export interface MSTInitialData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCount: number;
}

export function createMSTMachine(algorithmId: string, initialData?: MSTInitialData) {
  const initial = initialData
    ? { nodes: initialData.nodes, edges: initialData.edges }
    : generateRandomGraph(DEFAULT_NODE_COUNT);
  const nodeCount = initialData?.nodeCount ?? DEFAULT_NODE_COUNT;

  const regenerate = (ctx: MSTContext) => {
    const g = generateRandomGraph(ctx.nodeCount);
    return {
      nodes: g.nodes,
      edges: g.edges,
      sourceNode: 0,
      stats: resetStats(),
      stepIndex: 0,
      snapshot: null,
    };
  };

  /* Mid-play reset regenerates graph but preserves sourceNode selection */
  const playReset = (ctx: MSTContext) => {
    const g = generateRandomGraph(ctx.nodeCount);
    return {
      nodes: g.nodes,
      edges: g.edges,
      stats: resetStats(),
      stepIndex: 0,
      snapshot: null,
    };
  };

  return setup({
    types: { context: {} as MSTContext, events: {} as MSTEvent },
  }).createMachine({
    id: `mst-${algorithmId}`,
    initial: "idle",
    context: {
      nodes: initial.nodes,
      edges: initial.edges,
      nodeCount,
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
          const g = generateRandomGraph(count);
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
      generate: { actions: assign(({ context }) => regenerate(context)) },
      setSource: {
        actions: assign({
          sourceNode: ({ event }) => ("nodeId" in event ? event.nodeId : 0),
        }),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- visualizerStates returns a generic shape; XState's createMachine types can't infer the concrete state config
    states: visualizerStates({
      onReset: regenerate,
      onPlayReset: playReset,
      onSnapshot: (event, ctx) => ({
        snapshot: "snapshot" in event ? (event.snapshot as MSTSnapshot) : null,
        stats: "snapshot" in event && event.snapshot
          ? (event.snapshot as MSTSnapshot).stats
          : ctx.stats,
        stepIndex: ctx.stepIndex + 1,
      }),
    }) as any,
  });
}
