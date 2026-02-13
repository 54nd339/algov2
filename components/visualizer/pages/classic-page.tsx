"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Algorithm } from "@/config/algorithms";
import { useClassicMachine } from "@/lib/hooks/useClassicMachine";
import { getClassicAlgorithm } from "@/lib/algorithms/registry";
import { VisualizerPanel } from "@/components/common/visualizer-panel";
import { HanoiVisualizer } from "@/components/classic/hanoi-visualizer";
import { ClassicControlPanel } from "@/components/classic/classic-control-panel";
import { ClassicStatsPanel } from "@/components/classic/classic-stats-panel";
import { AlgoInfoSection } from "@/components/visualizer/algo-info-section";
import type { ClassicSnapshot } from "@/lib/types/classic";

interface ClassicPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function ClassicPage({ algoId, algorithm }: ClassicPageProps) {
  const { snapshot, send } = useClassicMachine(algoId);

  const generatorRef = useRef<Generator<ClassicSnapshot> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const isRunning = snapshot.matches("running");
  const isStepping = snapshot.matches("stepping");
  const isDone = snapshot.matches("done");
  const speed = snapshot.context.speed;
  const discCount = snapshot.context.discCount;
  const classicSnapshot = snapshot.context.snapshot;

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  const runStep = useCallback((): ClassicSnapshot | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) { generatorRef.current = null; return null; }
    return next.value;
  }, []);

  const startGenerator = useCallback(() => {
    const algoFn = getClassicAlgorithm(algoId);
    if (!algoFn) return;
    generatorRef.current = algoFn(discCount);
  }, [algoId, discCount]);

  // Show initial state on mount and when disc count / algo changes
  const showInitialState = useCallback(() => {
    generatorRef.current = null;
    const algoFn = getClassicAlgorithm(algoId);
    if (!algoFn) return;
    const gen = algoFn(discCount);
    const first = gen.next();
    if (!first.done && first.value) {
      generatorRef.current = gen;
      send({ type: "updateSnapshot", snapshot: first.value });
    }
  }, [algoId, discCount, send]);

  useEffect(() => {
    showInitialState();
  }, [showInitialState]);

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

  return (
    <div className="space-y-2">
      <ClassicControlPanel
        onPlay={() => send({ type: "play" })}
        onPause={() => send({ type: "pause" })}
        onStep={() => send({ type: "step" })}
        onReset={() => { stopLoop(); generatorRef.current = null; send({ type: "reset" }); showInitialState(); }}
        onSpeedChange={(s: number) => send({ type: "speedChange", speed: s })}
        onDiscCountChange={(c: number) => { stopLoop(); generatorRef.current = null; send({ type: "discCountChange", count: c }); }}
        onGenerate={() => { stopLoop(); send({ type: "reset" }); showInitialState(); }}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        discCount={discCount}
        showGenerate={false}
      />
      <VisualizerPanel>
        <HanoiVisualizer
          snapshot={classicSnapshot?.type === "tower-of-hanoi" ? classicSnapshot.data : null}
          discCount={discCount}
        />
      </VisualizerPanel>
      <ClassicStatsPanel snapshot={classicSnapshot} />
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
