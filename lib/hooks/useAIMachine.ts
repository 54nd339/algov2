"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createAIMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useAIMachine(algoId: string) {
  const machine = useMemo(() => createAIMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: "ai", autoGenerate: true });
  return { snapshot, send, state: stateOf(snapshot) };
}
