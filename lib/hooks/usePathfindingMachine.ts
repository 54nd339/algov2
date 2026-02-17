"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useActor } from "@xstate/react";
import { createPathfindingMachine } from "@/lib/machines";
import { useCategoryDataStore } from "@/stores";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function usePathfindingMachine(algoId: string) {
  const persistedData = useCategoryDataStore((s) => s.pathfindingData);
  const setPathfindingData = useCategoryDataStore((s) => s.setPathfindingData);

  const machine = useMemo(
    () => createPathfindingMachine(algoId, persistedData ?? undefined),
    // Only use persistedData on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [algoId],
  );
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "path-finding" });

  // Persist grid state whenever it changes
  const prevGridRef = useRef<unknown>(null);

  useEffect(() => {
    const ctx = snapshot.context;
    if (ctx.grid !== prevGridRef.current) {
      prevGridRef.current = ctx.grid;
      setPathfindingData({
        grid: ctx.grid,
        rows: ctx.rows,
        cols: ctx.cols,
        startNode: ctx.startNode,
        endNode: ctx.endNode,
      });
    }
  }, [snapshot.context, setPathfindingData]);

  // Wrap send to persist maze/grid changes
  const wrappedSend = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- event types vary per machine
    (event: any) => {
      send(event);
    },
    [send],
  );

  return { snapshot, send: wrappedSend, state: stateOf(snapshot) };
}
