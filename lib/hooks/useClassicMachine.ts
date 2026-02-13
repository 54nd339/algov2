"use client";

import { useEffect, useMemo } from "react";
import { useActor } from "@xstate/react";
import { createClassicMachine } from "@/lib/machines/classic-machine";
import { useAppStore } from "@/stores/app-store";

export function useClassicMachine(algoId: string) {
  const algoName = algoId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const setCurrentAlgo = useAppStore((s) => s.setCurrentAlgo);
  const machine = useMemo(() => createClassicMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);

  useEffect(() => {
    setCurrentAlgo({ categoryId: "classic", algoId, algoName });
    return () => setCurrentAlgo(null);
  }, [algoId, algoName, setCurrentAlgo]);

  return { snapshot, send };
}
