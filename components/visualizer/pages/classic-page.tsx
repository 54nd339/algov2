"use client";

import { useCallback } from "react";
import type { Algorithm } from "@/config";
import { useClassicMachine, useAnimationLoop, useMachineHandlers, useInitialPreview } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { VisualizerPanel } from "@/components/common";
import { HanoiVisualizer, ClassicControlPanel, ClassicStatsPanel } from "@/components/classic";
import { AlgoInfoSection } from "../algo-info-section";
import type { ClassicSnapshot, ClassicAlgorithmFn } from "@/lib/types";

interface ClassicPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function ClassicPage({ algoId, algorithm }: ClassicPageProps) {
  const { snapshot, send, state } = useClassicMachine(algoId);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const speed = snapshot.context.speed;
  const discCount = snapshot.context.discCount;
  const classicSnapshot = snapshot.context.snapshot;

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm<ClassicAlgorithmFn>("classic", algoId);
    if (!algoFn) return null;
    return algoFn(discCount);
  }, [algoId, discCount]);

  const onSnapshot = useCallback(
    (step: ClassicSnapshot) => send({ type: "updateSnapshot", snapshot: step }),
    [send],
  );
  const onDone = useCallback(() => send({ type: "done" }), [send]);

  const { generatorRef, clearLoop } = useAnimationLoop({
    isRunning,
    isStepping,
    isIdle: state === "idle",
    speed,
    createGenerator,
    onSnapshot,
    onDone,
  });

  const showInitialState = useInitialPreview<ClassicSnapshot>({
    generatorRef,
    send,
    createGenerator,
  });

  const { onPlay, onPause, onStep, onSpeedChange } = useMachineHandlers(send, clearLoop);
  const onClassicReset = useCallback(() => { clearLoop(); send({ type: "reset" }); showInitialState(); }, [clearLoop, send, showInitialState]);
  const onDiscCountChange = useCallback((c: number) => { clearLoop(); send({ type: "discCountChange", count: c }); }, [clearLoop, send]);

  return (
    <div className="space-y-2">
      <ClassicControlPanel
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onClassicReset}
        onSpeedChange={onSpeedChange}
        onDiscCountChange={onDiscCountChange}
        onGenerate={onClassicReset}
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
