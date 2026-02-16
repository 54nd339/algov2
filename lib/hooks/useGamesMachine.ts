"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createGamesMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useGamesMachine(algoId: string) {
  const machine = useMemo(() => createGamesMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "games" });
  return { snapshot, send, state: stateOf(snapshot) };
}
