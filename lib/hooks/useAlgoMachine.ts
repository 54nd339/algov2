"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createAlgoMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useAlgoMachine(category: "sorting" | "searching", algoId: string) {
  const machine = useMemo(() => createAlgoMachine(category, algoId), [category, algoId]);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: category, autoGenerate: true });
  return { snapshot, send, state: stateOf(snapshot) };
}
