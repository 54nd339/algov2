"use client";

import { useEffect, useMemo } from "react";
import { useActor } from "@xstate/react";
import { createAIMachine } from "@/lib/machines/ai-machine";
import { useAppStore } from "@/stores/app-store";

export function useAIMachine(algoId: string) {
  const algoName = algoId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const setCurrentAlgo = useAppStore((s) => s.setCurrentAlgo);
  const machine = useMemo(() => createAIMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);

  useEffect(() => {
    setCurrentAlgo({ categoryId: "ai", algoId, algoName });
    return () => setCurrentAlgo(null);
  }, [algoId, algoName, setCurrentAlgo]);

  useEffect(() => {
    send({ type: "generate" });
  }, [send]);

  return { snapshot, send };
}
