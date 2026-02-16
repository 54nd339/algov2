"use client";

import { useEffect, useMemo } from "react";
import { useAppStore } from "@/stores";
import { formatAlgoName } from "@/lib/utils";

export type VisualizerState = "idle" | "running" | "paused" | "stepping" | "done";

/** Extract the flat state value from an xstate snapshot as a typed string. */
export function stateOf(snapshot: { value: unknown }): VisualizerState {
  return snapshot.value as VisualizerState;
}

interface UseVisualizerSetupOptions {
  categoryId: string;
  autoGenerate?: boolean;
}

/**
 * Side-effect helper shared by all visualizer machine hooks.
 * Registers the current algorithm in the global app store and
 * optionally fires a "generate" event on mount.
 *
 * Each hook still calls `useActor` directly to keep full type safety.
 */
export function useVisualizerSetup(
  algoId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each machine has its own event union; a generic `any` avoids coupling this hook to every machine type
  send: (event: any) => void,
  { categoryId, autoGenerate = false }: UseVisualizerSetupOptions,
) {
  const algoName = useMemo(() => formatAlgoName(algoId), [algoId]);
  const setCurrentAlgo = useAppStore((s) => s.setCurrentAlgo);

  useEffect(() => {
    setCurrentAlgo({ categoryId, algoId, algoName });
    return () => setCurrentAlgo(null);
  }, [categoryId, algoId, algoName, setCurrentAlgo]);

  useEffect(() => {
    if (autoGenerate) send({ type: "generate" });
  }, [autoGenerate, send]);
}
