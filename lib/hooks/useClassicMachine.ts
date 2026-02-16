"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createClassicMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useClassicMachine(algoId: string) {
  const machine = useMemo(() => createClassicMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "classic" });
  return { snapshot, send, state: stateOf(snapshot) };
}
