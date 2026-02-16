"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createPathfindingMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function usePathfindingMachine(algoId: string) {
  const machine = useMemo(() => createPathfindingMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "path-finding" });
  return { snapshot, send, state: stateOf(snapshot) };
}
