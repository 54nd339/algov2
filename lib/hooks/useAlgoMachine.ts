"use client";

import { useEffect, useMemo } from "react";
import { useActor } from "@xstate/react";
import { createAlgoMachine } from "@/lib/machines/algo-machine";
import { useAppStore } from "@/stores/app-store";

export function useAlgoMachine(category: "sorting" | "searching", algoId: string) {
  const algoName = algoId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const setCurrentAlgo = useAppStore((s) => s.setCurrentAlgo);
  const machine = useMemo(
    () => createAlgoMachine(category, algoId),
    [category, algoId],
  );
  const [snapshot, send] = useActor(machine);

  useEffect(() => {
    setCurrentAlgo({ categoryId: category, algoId, algoName });
    return () => setCurrentAlgo(null);
  }, [category, algoId, algoName, setCurrentAlgo]);

  useEffect(() => {
    send({ type: "generate" });
  }, [send]);

  return { snapshot, send };
}
