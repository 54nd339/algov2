"use client";

import { useCallback } from "react";
import type { Algorithm } from "@/config";
import { useAIMachine, useAnimationLoop, useMachineHandlers } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { VisualizerPanel } from "@/components/common";
import { AIVisualizer, AIControlPanel, AIStatsPanel } from "@/components/ai";
import { AlgoInfoSection } from "../algo-info-section";
import type { AISnapshot, DataPoint, AIAlgorithmFn } from "@/lib/types";
import { assignLabel } from "@/lib/algorithms/ai";

interface AIPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function AIPage({ algoId, algorithm }: AIPageProps) {
  const { snapshot, send, state } = useAIMachine(algoId);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const dataPoints = snapshot.context.dataPoints;
  const speed = snapshot.context.speed;
  const pointCount = snapshot.context.pointCount;
  const aiSnapshot = snapshot.context.snapshot;

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm<AIAlgorithmFn>("ai", algoId);
    if (!algoFn) return null;
    return algoFn([...dataPoints.map((p: DataPoint) => ({ ...p }))], {
      k: snapshot.context.k,
      learningRate: snapshot.context.learningRate,
    });
  }, [algoId, dataPoints, snapshot.context.k, snapshot.context.learningRate]);

  const onSnapshot = useCallback(
    (step: AISnapshot) => send({ type: "updateSnapshot", snapshot: step }),
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

  const handleAddPoint = useCallback(
    (point: DataPoint) => {
      if (isRunning) return;
      const nextPoint: DataPoint = {
        ...point,
        label: assignLabel(algoId, snapshot.context.k),
      };
      send({ type: "setPoints", points: [...dataPoints, nextPoint] });
    },
    [algoId, dataPoints, isRunning, send, snapshot.context.k],
  );

  const { onPlay, onPause, onStep, onReset, onSpeedChange } = useMachineHandlers(send, clearLoop);
  const onPointCountChange = useCallback((c: number) => { clearLoop(); send({ type: "pointCountChange", count: c }); }, [clearLoop, send]);
  const onGenerate = useCallback(() => { clearLoop(); send({ type: "generate" }); }, [clearLoop, send]);
  const onKChange = useCallback((k: number) => { clearLoop(); send({ type: "kChange", k }); }, [clearLoop, send]);

  return (
    <div className="space-y-2">
      <AIControlPanel
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
        onPointCountChange={onPointCountChange}
        onGenerate={onGenerate}
        onKChange={onKChange}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        pointCount={pointCount}
        k={snapshot.context.k}
        showK={algoId === "knn" || algoId === "k-means"}
      />
      <VisualizerPanel>
        <AIVisualizer
          snapshot={aiSnapshot}
          dataPoints={dataPoints}
          onAddPoint={handleAddPoint}
          disabled={isRunning}
        />
      </VisualizerPanel>
      <AIStatsPanel
        snapshot={aiSnapshot}
        totalPoints={dataPoints.length}
        algoId={algoId}
        learningRate={snapshot.context.learningRate}
        k={snapshot.context.k}
      />
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
