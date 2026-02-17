"use client";

import { useEffect, useMemo, useRef } from "react";
import { useActor } from "@xstate/react";
import { createGraphMachine } from "@/lib/machines";
import { useCategoryDataStore } from "@/stores";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useGraphMachine(algoId: string) {
  const persistedData = useCategoryDataStore((s) => s.graphData);
  const setGraphData = useCategoryDataStore((s) => s.setGraphData);

  const machine = useMemo(
    () => createGraphMachine(algoId, persistedData ?? undefined),
    // Only use persistedData on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [algoId],
  );
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "shortest-path", autoGenerate: !persistedData });

  // Persist graph data whenever nodes/edges change
  const prevNodesRef = useRef<unknown>(null);

  useEffect(() => {
    const ctx = snapshot.context;
    if (ctx.nodes !== prevNodesRef.current) {
      prevNodesRef.current = ctx.nodes;
      setGraphData({
        nodes: ctx.nodes,
        edges: ctx.edges,
        nodeCount: ctx.nodeCount,
      });
    }
  }, [snapshot.context, setGraphData]);

  return { snapshot, send, state: stateOf(snapshot) };
}
