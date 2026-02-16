"use client";

import { useCallback, useState } from "react";
import type { Algorithm } from "@/config";
import { useAlgoMachine, useAnimationLoop, useMachineHandlers } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { ControlPanel, VisualizerPanel, StatsPanel, ArrayDisplay } from "@/components/common";
import { SortingVisualizer } from "@/components/sorting";
import { SearchingVisualizer } from "@/components/searching";
import { AlgoInfoSection } from "../algo-info-section";
import type { AlgorithmSnapshot } from "@/lib/types";

interface ArrayPageProps {
  categoryId: "sorting" | "searching";
  algoId: string;
  algorithm: Algorithm;
}

export function ArrayPage({ categoryId, algoId, algorithm }: ArrayPageProps) {
  const [searchTarget, setSearchTarget] = useState<number | null>(null);
  const { snapshot, send, state } = useAlgoMachine(categoryId, algoId);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const array = snapshot.context.array;
  const speed = snapshot.context.speed;
  const stats = snapshot.context.stats;
  const algorithmSnapshot = snapshot.context.snapshot;

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm(categoryId, algoId);
    if (!algoFn) return null;
    const target = categoryId === "searching"
      ? (searchTarget ?? array[Math.floor(Math.random() * array.length)])
      : undefined;
    return algoFn([...array], target);
  }, [categoryId, algoId, array, searchTarget]);

  const onSnapshot = useCallback(
    (step: AlgorithmSnapshot) => send({ type: "updateSnapshot", snapshot: step }),
    [send],
  );
  const onDone = useCallback(() => send({ type: "done" }), [send]);

  const { clearLoop } = useAnimationLoop({
    isRunning,
    isStepping,
    isIdle: state === "idle",
    speed,
    createGenerator,
    onSnapshot,
    onDone,
  });

  const { onPlay, onPause, onStep, onSpeedChange } = useMachineHandlers(send, clearLoop);
  const onReset = useCallback(() => { clearLoop(); setSearchTarget(null); send({ type: "reset" }); }, [clearLoop, send]);
  const onSizeChange = useCallback((s: number) => { setSearchTarget(null); send({ type: "sizeChange", size: s }); }, [send]);
  const onGenerate = useCallback(() => { clearLoop(); setSearchTarget(null); send({ type: "generate" }); }, [clearLoop, send]);
  const onBarClick = useCallback((value: number) => {
    if (!isRunning && !isDone) setSearchTarget(value);
  }, [isRunning, isDone]);

  const actionLabel = categoryId === "sorting" ? "Sort" : "Search";

  return (
    <div className="space-y-2">
      <ControlPanel
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
        onSizeChange={onSizeChange}
        onGenerate={onGenerate}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        arraySize={array.length}
        actionLabel={actionLabel}
      />
      <VisualizerPanel>
        {categoryId === "sorting" ? (
          <SortingVisualizer array={array} snapshot={algorithmSnapshot} />
        ) : (
          <SearchingVisualizer
            array={array}
            snapshot={algorithmSnapshot}
            searchTarget={searchTarget}
            onBarClick={onBarClick}
          />
        )}
      </VisualizerPanel>
      <div>
        <StatsPanel
          comparisons={stats.comparisons}
          swaps={stats.swaps}
          accesses={stats.accesses}
          timeElapsed={stats.timeElapsed}
          total={array.length}
        />
        <div className="border border-border bg-card">
          <div className="flex items-center justify-between px-3 py-2">
            <ArrayDisplay array={array} snapshot={algorithmSnapshot} />
            <span className="shrink-0 font-space text-xs uppercase tracking-wider text-muted-foreground">
              Total <span className="text-algo-cyan">{array.length}</span>
            </span>
          </div>
        </div>
      </div>
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
