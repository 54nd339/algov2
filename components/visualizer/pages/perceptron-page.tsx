"use client";

import { useCallback, useRef } from "react";
import type { Algorithm } from "@/config";
import { usePerceptronMachine, useAnimationLoop, useMachineHandlers, useInitialPreview } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { initializeNetwork } from "@/lib/algorithms/ai";
import { VisualizerPanel } from "@/components/common";
import { PerceptronControlPanel, PerceptronVisualizer, PerceptronStatsPanel } from "@/components/ai";
import { AlgoInfoSection } from "../algo-info-section";
import type { PerceptronSnapshot, PerceptronAlgorithmFn, PerceptronLayer } from "@/lib/types";

interface PerceptronPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function PerceptronPage({ algoId, algorithm }: PerceptronPageProps) {
  const { snapshot, send, state } = usePerceptronMachine();
  const networkRef = useRef<PerceptronLayer[] | null>(null);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const speed = snapshot.context.speed;
  const layers = snapshot.context.layers;
  const neuronsPerLayer = snapshot.context.neuronsPerLayer;
  const activationFunction = snapshot.context.activationFunction;
  const totalEpochs = snapshot.context.totalEpochs;
  const perceptronSnapshot = snapshot.context.snapshot;

  const getOrCreateNetwork = useCallback(() => {
    if (!networkRef.current) {
      networkRef.current = initializeNetwork(2, layers, neuronsPerLayer);
    }
    return networkRef.current;
  }, [layers, neuronsPerLayer]);

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm<PerceptronAlgorithmFn>("ai", algoId);
    if (!algoFn) return null;
    return algoFn(getOrCreateNetwork(), { activationFunction, totalEpochs });
  }, [algoId, getOrCreateNetwork, activationFunction, totalEpochs]);

  const onSnapshot = useCallback(
    (step: PerceptronSnapshot) => send({ type: "updateSnapshot", snapshot: step }),
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

  const showInitialState = useInitialPreview<PerceptronSnapshot>({
    generatorRef,
    send,
    createGenerator,
  });

  const { onPlay, onPause, onStep, onSpeedChange } = useMachineHandlers(send, clearLoop);

  const onPerceptronReset = useCallback(() => {
    networkRef.current = null;
    clearLoop();
    send({ type: "reset" });
    showInitialState();
  }, [clearLoop, send, showInitialState]);

  const onLayersChange = useCallback(
    (l: number) => { networkRef.current = null; clearLoop(); send({ type: "layersChange", layers: l }); },
    [clearLoop, send],
  );

  const onActivationChange = useCallback(
    (fn: typeof activationFunction) => { clearLoop(); send({ type: "activationChange", fn }); },
    [clearLoop, send],
  );

  return (
    <div className="space-y-2">
      <PerceptronControlPanel
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onPerceptronReset}
        onSpeedChange={onSpeedChange}
        onLayersChange={onLayersChange}
        onActivationChange={onActivationChange}
        onGenerate={onPerceptronReset}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        layers={layers}
        activationFunction={activationFunction}
      />
      <VisualizerPanel>
        <PerceptronVisualizer snapshot={perceptronSnapshot} />
      </VisualizerPanel>
      <PerceptronStatsPanel snapshot={perceptronSnapshot} layers={layers} activation={activationFunction} />
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
