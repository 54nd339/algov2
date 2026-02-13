"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Algorithm } from "@/config/algorithms";
import { useGraphMachine } from "@/lib/hooks/useGraphMachine";
import { getGraphAlgorithm } from "@/lib/algorithms/registry";
import { VisualizerPanel } from "@/components/common/visualizer-panel";
import { GraphVisualizer } from "@/components/shortest-path/graph-visualizer";
import { GraphControlPanel } from "@/components/shortest-path/graph-control-panel";
import { GraphStatsPanel } from "@/components/shortest-path/graph-stats-panel";
import { DistanceMatrix } from "@/components/shortest-path/distance-matrix";
import { AlgoInfoSection } from "@/components/visualizer/algo-info-section";
import type { GraphSnapshot } from "@/lib/types/graph";

interface GraphPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function GraphPage({ algoId, algorithm }: GraphPageProps) {
  const { snapshot, send } = useGraphMachine(algoId);

  const generatorRef = useRef<Generator<GraphSnapshot> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const isRunning = snapshot.matches("running");
  const isStepping = snapshot.matches("stepping");
  const isDone = snapshot.matches("done");
  const nodes = snapshot.context.nodes;
  const edges = snapshot.context.edges;
  const speed = snapshot.context.speed;
  const nodeCount = snapshot.context.nodeCount;
  const stats = snapshot.context.stats;
  const graphSnapshot = snapshot.context.snapshot;
  const sourceNode = snapshot.context.sourceNode;

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  const runStep = useCallback((): GraphSnapshot | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) { generatorRef.current = null; return null; }
    return next.value;
  }, []);

  const startGenerator = useCallback(() => {
    const algoFn = getGraphAlgorithm(algoId);
    if (!algoFn || sourceNode === null) return;
    generatorRef.current = algoFn([...nodes], [...edges], sourceNode);
  }, [algoId, nodes, edges, sourceNode]);

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

  return (
    <div className="space-y-2">
      <GraphControlPanel
        onPlay={() => send({ type: "play" })}
        onPause={() => send({ type: "pause" })}
        onStep={() => send({ type: "step" })}
        onReset={() => { stopLoop(); generatorRef.current = null; send({ type: "reset" }); }}
        onSpeedChange={(s) => send({ type: "speedChange", speed: s })}
        onNodeCountChange={(c) => { stopLoop(); generatorRef.current = null; send({ type: "nodeCountChange", count: c }); }}
        onGenerate={() => { stopLoop(); generatorRef.current = null; send({ type: "generate" }); }}
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
          onNodeClick={(id) => {
            if (!isRunning) send({ type: "setSource", nodeId: id });
          }}
        />
      </VisualizerPanel>
      <p className="px-2 text-[10px] font-space uppercase tracking-wider text-muted-foreground">
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
