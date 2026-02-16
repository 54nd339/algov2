"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createGraphMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useGraphMachine(algoId: string) {
  const machine = useMemo(() => createGraphMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "shortest-path", autoGenerate: true });
  return { snapshot, send, state: stateOf(snapshot) };
}
