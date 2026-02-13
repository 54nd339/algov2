"use client";

import { useEffect, useMemo } from "react";
import { useActor } from "@xstate/react";
import { createGamesMachine } from "@/lib/machines/games-machine";
import { useAppStore } from "@/stores/app-store";

export function useGamesMachine(algoId: string) {
  const algoName = algoId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const setCurrentAlgo = useAppStore((s) => s.setCurrentAlgo);
  const machine = useMemo(() => createGamesMachine(algoId), [algoId]);
  const [snapshot, send] = useActor(machine);

  useEffect(() => {
    setCurrentAlgo({ categoryId: "games", algoId, algoName });
    return () => setCurrentAlgo(null);
  }, [algoId, algoName, setCurrentAlgo]);

  return { snapshot, send };
}
