"use client";

import { useMemo } from "react";
import { useActor } from "@xstate/react";
import { createPerceptronMachine } from "@/lib/machines";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function usePerceptronMachine() {
  const machine = useMemo(() => createPerceptronMachine(), []);
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup("perceptron", send, { categoryId: "ai" });
  return { snapshot, send, state: stateOf(snapshot) };
}
