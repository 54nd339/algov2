"use client";

import { useCallback } from "react";
import type { Algorithm } from "@/config";
import { useMSTMachine, useAnimationLoop, useMachineHandlers } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { VisualizerPanel } from "@/components/common";
import { MSTVisualizer, MSTControlPanel, MSTStatsPanel } from "@/components/mst";
import { AlgoInfoSection } from "../algo-info-section";
import type { MSTSnapshot, MSTAlgorithmFn } from "@/lib/types";

interface MSTPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function MSTPage({ algoId, algorithm }: MSTPageProps) {
  const { snapshot, send, state } = useMSTMachine(algoId);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const nodes = snapshot.context.nodes;
  const edges = snapshot.context.edges;
  const speed = snapshot.context.speed;
  const nodeCount = snapshot.context.nodeCount;
  const sourceNode = snapshot.context.sourceNode;
  const stats = snapshot.context.stats;
  const mstSnapshot = snapshot.context.snapshot;

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm<MSTAlgorithmFn>("mst", algoId);
    if (!algoFn) return null;
    return algoFn([...nodes], [...edges], sourceNode);
  }, [algoId, nodes, edges, sourceNode]);

  const onSnapshot = useCallback(
    (step: MSTSnapshot) => send({ type: "updateSnapshot", snapshot: step }),
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

  const { onPlay, onPause, onStep, onReset, onSpeedChange } = useMachineHandlers(send, clearLoop);
  const onNodeCountChange = useCallback((c: number) => { clearLoop(); send({ type: "nodeCountChange", count: c }); }, [clearLoop, send]);
  const onGenerate = useCallback(() => { clearLoop(); send({ type: "generate" }); }, [clearLoop, send]);
  const onNodeClick = useCallback((id: number) => {
    if (!isRunning) send({ type: "setSource", nodeId: id });
  }, [isRunning, send]);

  return (
    <div className="space-y-2">
      <MSTControlPanel
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
        onNodeCountChange={onNodeCountChange}
        onGenerate={onGenerate}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        nodeCount={nodeCount}
      />
      <VisualizerPanel>
        <MSTVisualizer
          nodes={nodes}
          edges={edges}
          snapshot={mstSnapshot}
          sourceNode={sourceNode}
          onNodeClick={onNodeClick}
        />
      </VisualizerPanel>
      <p className="px-2 text-2xs font-space uppercase tracking-wider text-muted-foreground">
        Tip: click a node to set the source
      </p>
      <MSTStatsPanel
        edgesInMST={stats.edgesInMST}
        totalWeight={stats.totalWeight}
        edgesChecked={stats.edgesChecked}
        timeElapsed={stats.timeElapsed}
        totalNodes={nodes.length}
      />
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
