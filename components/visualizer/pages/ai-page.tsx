"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Algorithm } from "@/config/algorithms";
import { useAIMachine } from "@/lib/hooks/useAIMachine";
import { getAIAlgorithm } from "@/lib/algorithms/registry";
import { VisualizerPanel } from "@/components/common/visualizer-panel";
import { AIVisualizer } from "@/components/ai/ai-visualizer";
import { AIControlPanel } from "@/components/ai/ai-control-panel";
import { AIStatsPanel } from "@/components/ai/ai-stats-panel";
import { AlgoInfoSection } from "@/components/visualizer/algo-info-section";
import type { AISnapshot, DataPoint } from "@/lib/types/ai";

interface AIPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function AIPage({ algoId, algorithm }: AIPageProps) {
  const { snapshot, send } = useAIMachine(algoId);

  const generatorRef = useRef<Generator<AISnapshot> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const isRunning = snapshot.matches("running");
  const isStepping = snapshot.matches("stepping");
  const isDone = snapshot.matches("done");
  const dataPoints = snapshot.context.dataPoints;
  const speed = snapshot.context.speed;
  const pointCount = snapshot.context.pointCount;
  const aiSnapshot = snapshot.context.snapshot;

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  const runStep = useCallback((): AISnapshot | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) { generatorRef.current = null; return null; }
    return next.value;
  }, []);

  const startGenerator = useCallback(() => {
    const algoFn = getAIAlgorithm(algoId);
    if (!algoFn) return;
    generatorRef.current = algoFn([...dataPoints.map((p) => ({ ...p }))], {
      k: snapshot.context.k,
      learningRate: snapshot.context.learningRate,
    });
  }, [algoId, dataPoints, snapshot.context.k, snapshot.context.learningRate]);

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

  const handleAddPoint = useCallback(
    (point: DataPoint) => {
      if (isRunning) return;
      const nextPoint: DataPoint = {
        ...point,
        label: algoId === "knn" ? Math.floor(Math.random() * snapshot.context.k) : undefined,
      };
      send({ type: "setPoints", points: [...dataPoints, nextPoint] });
    },
    [algoId, dataPoints, isRunning, send, snapshot.context.k],
  );

  return (
    <div className="space-y-2">
      <AIControlPanel
        onPlay={() => send({ type: "play" })}
        onPause={() => send({ type: "pause" })}
        onStep={() => send({ type: "step" })}
        onReset={() => { stopLoop(); generatorRef.current = null; send({ type: "reset" }); }}
        onSpeedChange={(s) => send({ type: "speedChange", speed: s })}
        onPointCountChange={(c) => { stopLoop(); generatorRef.current = null; send({ type: "pointCountChange", count: c }); }}
        onGenerate={() => { stopLoop(); generatorRef.current = null; send({ type: "generate" }); }}
        onKChange={(k) => { stopLoop(); generatorRef.current = null; send({ type: "kChange", k }); }}
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
