"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Algorithm } from "@/config/algorithms";
import { useAlgoMachine } from "@/lib/hooks/useAlgoMachine";
import { getAlgorithm } from "@/lib/algorithms/registry";
import { ControlPanel } from "@/components/common/control-panel";
import { VisualizerPanel } from "@/components/common/visualizer-panel";
import { StatsPanel } from "@/components/common/stats-panel";
import { ArrayDisplay } from "@/components/common/array-display";
import { SortingVisualizer } from "@/components/sorting/sorting-visualizer";
import { SearchingVisualizer } from "@/components/searching/searching-visualizer";
import { AlgoInfoSection } from "@/components/visualizer/algo-info-section";
import type { AlgorithmSnapshot } from "@/lib/types/algorithms";

interface ArrayPageProps {
  categoryId: "sorting" | "searching";
  algoId: string;
  algorithm: Algorithm;
}

export function ArrayPage({ categoryId, algoId, algorithm }: ArrayPageProps) {
  const [searchTarget, setSearchTarget] = useState<number | null>(null);
  const { snapshot, send } = useAlgoMachine(categoryId, algoId);

  const generatorRef = useRef<Generator<AlgorithmSnapshot> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const isRunning = snapshot.matches("running");
  const isStepping = snapshot.matches("stepping");
  const isDone = snapshot.matches("done");
  const array = snapshot.context.array;
  const speed = snapshot.context.speed;
  const stats = snapshot.context.stats;
  const algorithmSnapshot = snapshot.context.snapshot;

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const runStep = useCallback((): AlgorithmSnapshot | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) {
      generatorRef.current = null;
      return null;
    }
    return next.value as AlgorithmSnapshot;
  }, []);

  const startGenerator = useCallback(() => {
    const algoFn = getAlgorithm(categoryId, algoId);
    if (!algoFn) return;
    const target = categoryId === "searching"
      ? (searchTarget ?? array[Math.floor(Math.random() * array.length)])
      : undefined;
    generatorRef.current = algoFn([...array], target);
  }, [categoryId, algoId, array, searchTarget]);

  useEffect(() => {
    if (!isRunning) return;
    if (!generatorRef.current) startGenerator();
    cancelledRef.current = false;
    let lastTime = 0;
    const msPerFrame = 1000 / speed;
    const tick = (timestamp: number) => {
      if (cancelledRef.current) return;
      if (timestamp - lastTime >= msPerFrame) {
        lastTime = timestamp;
        const step = runStep();
        if (step) send({ type: "updateSnapshot", snapshot: step });
        else { send({ type: "done" }); return; }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => stopLoop();
  }, [isRunning, speed, send, runStep, startGenerator, stopLoop]);

  useEffect(() => {
    if (!isStepping) return;
    if (!generatorRef.current) startGenerator();
    const step = runStep();
    if (step) send({ type: "updateSnapshot", snapshot: step });
    else send({ type: "done" });
  }, [isStepping, send, runStep, startGenerator]);

  useEffect(() => {
    if (snapshot.matches("idle") && generatorRef.current) {
      stopLoop();
      generatorRef.current = null;
    }
  }, [snapshot, stopLoop]);

  const actionLabel = categoryId === "sorting" ? "Sort" : "Search";

  return (
    <div className="space-y-2">
      <ControlPanel
        onPlay={() => send({ type: "play" })}
        onPause={() => send({ type: "pause" })}
        onStep={() => send({ type: "step" })}
        onReset={() => { stopLoop(); generatorRef.current = null; setSearchTarget(null); send({ type: "reset" }); }}
        onSpeedChange={(s) => send({ type: "speedChange", speed: s })}
        onSizeChange={(s) => { setSearchTarget(null); send({ type: "sizeChange", size: s }); }}
        onGenerate={() => { stopLoop(); generatorRef.current = null; setSearchTarget(null); send({ type: "generate" }); }}
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
            onBarClick={(value) => {
              if (!isRunning && !isDone) setSearchTarget(value);
            }}
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
