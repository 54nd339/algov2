"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Algorithm } from "@/config/algorithms";
import { useMSTMachine } from "@/lib/hooks/useMSTMachine";
import { getMSTAlgorithm } from "@/lib/algorithms/registry";
import { VisualizerPanel } from "@/components/common/visualizer-panel";
import { MSTVisualizer } from "@/components/mst/mst-visualizer";
import { MSTControlPanel } from "@/components/mst/mst-control-panel";
import { MSTStatsPanel } from "@/components/mst/mst-stats-panel";
import { AlgoInfoSection } from "@/components/visualizer/algo-info-section";
import type { MSTSnapshot } from "@/lib/types/mst";

interface MSTPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function MSTPage({ algoId, algorithm }: MSTPageProps) {
  const { snapshot, send } = useMSTMachine(algoId);

  const generatorRef = useRef<Generator<MSTSnapshot> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const isRunning = snapshot.matches("running");
  const isStepping = snapshot.matches("stepping");
  const isDone = snapshot.matches("done");
  const nodes = snapshot.context.nodes;
  const edges = snapshot.context.edges;
  const speed = snapshot.context.speed;
  const nodeCount = snapshot.context.nodeCount;
  const sourceNode = snapshot.context.sourceNode;
  const stats = snapshot.context.stats;
  const mstSnapshot = snapshot.context.snapshot;

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  const runStep = useCallback((): MSTSnapshot | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) { generatorRef.current = null; return null; }
    return next.value;
  }, []);

  const startGenerator = useCallback(() => {
    const algoFn = getMSTAlgorithm(algoId);
    if (!algoFn) return;
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
      <MSTControlPanel
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
        <MSTVisualizer
          nodes={nodes}
          edges={edges}
          snapshot={mstSnapshot}
          sourceNode={sourceNode}
          onNodeClick={(id) => {
            if (!isRunning) send({ type: "setSource", nodeId: id });
          }}
        />
      </VisualizerPanel>
      <p className="px-2 text-[10px] font-space uppercase tracking-wider text-muted-foreground">
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
