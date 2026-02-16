"use client";

import { useCallback } from "react";
import type { Algorithm } from "@/config";
import { useGraphMachine, useAnimationLoop, useMachineHandlers } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { VisualizerPanel } from "@/components/common";
import { GraphVisualizer, GraphControlPanel, GraphStatsPanel, DistanceMatrix } from "@/components/shortest-path";
import { AlgoInfoSection } from "../algo-info-section";
import type { GraphSnapshot, GraphAlgorithmFn } from "@/lib/types";

interface GraphPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function GraphPage({ algoId, algorithm }: GraphPageProps) {
  const { snapshot, send, state } = useGraphMachine(algoId);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const nodes = snapshot.context.nodes;
  const edges = snapshot.context.edges;
  const speed = snapshot.context.speed;
  const nodeCount = snapshot.context.nodeCount;
  const stats = snapshot.context.stats;
  const graphSnapshot = snapshot.context.snapshot;
  const sourceNode = snapshot.context.sourceNode;

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm<GraphAlgorithmFn>("shortest-path", algoId);
    if (!algoFn || sourceNode === null) return null;
    return algoFn([...nodes], [...edges], sourceNode);
  }, [algoId, nodes, edges, sourceNode]);

  const onSnapshot = useCallback(
    (step: GraphSnapshot) => send({ type: "updateSnapshot", snapshot: step }),
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
      <GraphControlPanel
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
        <GraphVisualizer
          nodes={nodes}
          edges={edges}
          snapshot={graphSnapshot}
          sourceNode={sourceNode}
          onNodeClick={onNodeClick}
        />
      </VisualizerPanel>
      <p className="px-2 text-2xs font-space uppercase tracking-wider text-muted-foreground">
        Tip: click a node to set the source
      </p>
      <GraphStatsPanel
        nodesVisited={stats.nodesVisited}
        edgesRelaxed={stats.edgesRelaxed}
        totalDistance={stats.totalDistance}
        timeElapsed={stats.timeElapsed}
        totalNodes={nodes.length}
      />
      {algoId === "floyd-warshall" && graphSnapshot?.allDistances && (
        <DistanceMatrix allDistances={graphSnapshot.allDistances} nodes={nodes} />
      )}
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
