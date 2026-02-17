"use client";

import { useEffect, useMemo, useRef } from "react";
import { useActor } from "@xstate/react";
import { createMSTMachine } from "@/lib/machines";
import { useCategoryDataStore } from "@/stores";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useMSTMachine(algoId: string) {
  const persistedData = useCategoryDataStore((s) => s.mstData);
  const setMstData = useCategoryDataStore((s) => s.setMstData);

  const machine = useMemo(
    () => createMSTMachine(algoId, persistedData ?? undefined),
    // Only use persistedData on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [algoId],
  );
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "mst", autoGenerate: !persistedData });

  // Persist graph data whenever nodes/edges change
  const prevNodesRef = useRef<unknown>(null);

  useEffect(() => {
    const ctx = snapshot.context;
    if (ctx.nodes !== prevNodesRef.current) {
      prevNodesRef.current = ctx.nodes;
      setMstData({
        nodes: ctx.nodes,
        edges: ctx.edges,
        nodeCount: ctx.nodeCount,
      });
    }
  }, [snapshot.context, setMstData]);

  return { snapshot, send, state: stateOf(snapshot) };
}
