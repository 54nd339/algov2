"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createMSTMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useMSTMachine(algoId: string) {
  const machine = useMemo(() => createMSTMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "mst", autoGenerate: true });
  return { snapshot, send, state: stateOf(snapshot) };
}
