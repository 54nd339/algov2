"use client";

import { useEffect, useMemo } from "react";
import { useActor } from "@xstate/react";
import { createGraphMachine } from "@/lib/machines/graph-machine";
import { useAppStore } from "@/stores/app-store";

export function useGraphMachine(algoId: string) {
  const algoName = algoId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const setCurrentAlgo = useAppStore((s) => s.setCurrentAlgo);
  const machine = useMemo(
    () => createGraphMachine(algoId),
    [algoId],
  );
  const [snapshot, send] = useActor(machine);

  useEffect(() => {
    setCurrentAlgo({ categoryId: "shortest-path", algoId, algoName });
    return () => setCurrentAlgo(null);
  }, [algoId, algoName, setCurrentAlgo]);

  useEffect(() => {
    send({ type: "generate" });
  }, [send]);

  return { snapshot, send };
}
