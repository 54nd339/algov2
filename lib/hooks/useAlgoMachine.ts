"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useActor } from "@xstate/react";
import { createAlgoMachine } from "@/lib/machines";
import { useCategoryDataStore } from "@/stores";
import { useVisualizerSetup, stateOf } from "./useVisualizerMachine";

export function useAlgoMachine(category: "sorting" | "searching", algoId: string) {
  const persistedArray = useCategoryDataStore((s) =>
    category === "sorting" ? s.sortingArray : s.searchingArray,
  );
  const setArray = useCategoryDataStore((s) =>
    category === "sorting" ? s.setSortingArray : s.setSearchingArray,
  );

  const machine = useMemo(
    () => createAlgoMachine(category, algoId, persistedArray ?? undefined),
    // Only use persistedArray on first mount — ignore subsequent changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, algoId],
  );
  const [snapshot, send] = useActor(machine);
  useVisualizerSetup(algoId, send, { categoryId: category, autoGenerate: !persistedArray });

  // Persist array to store whenever context.array changes
  const arrayRef = useRef(snapshot.context.array);
  const prevArrayRef = useRef<number[] | null>(null);

  useEffect(() => {
    const arr = snapshot.context.array;
    if (arr !== prevArrayRef.current) {
      prevArrayRef.current = arr;
      arrayRef.current = arr;
      setArray(arr);
    }
  }, [snapshot.context.array, setArray]);

  // Wrap send to also persist on generate/sizeChange
  const wrappedSend = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- event types vary per machine
    (event: any) => {
      send(event);
    },
    [send],
  );

  return { snapshot, send: wrappedSend, state: stateOf(snapshot) };
}
