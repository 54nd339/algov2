"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Algorithm } from "@/config/algorithms";
import { usePathfindingMachine } from "@/lib/hooks/usePathfindingMachine";
import { getPathfindingAlgorithm } from "@/lib/algorithms/registry";
import { cloneGrid } from "@/lib/algorithms/pathfinding/grid";
import { VisualizerPanel } from "@/components/common/visualizer-panel";
import { PathfindingControlPanel } from "@/components/pathfinding/pathfinding-control-panel";
import { PathfindingStatsPanel } from "@/components/pathfinding/pathfinding-stats-panel";
import { GridVisualizer } from "@/components/pathfinding/grid-visualizer";
import { AlgoInfoSection } from "@/components/visualizer/algo-info-section";
import type { PathfindingSnapshot } from "@/lib/types/pathfinding";

interface PathfindingPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function PathfindingPage({ algoId, algorithm }: PathfindingPageProps) {
  const { snapshot, send } = usePathfindingMachine(algoId);

  const generatorRef = useRef<Generator<PathfindingSnapshot> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const isRunning = snapshot.matches("running");
  const isStepping = snapshot.matches("stepping");
  const isDone = snapshot.matches("done");
  const grid = snapshot.context.grid;
  const speed = snapshot.context.speed;
  const stats = snapshot.context.stats;
  const pfSnapshot = snapshot.context.snapshot;
  const startNode = snapshot.context.startNode;
  const endNode = snapshot.context.endNode;

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  const runStep = useCallback((): PathfindingSnapshot | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) { generatorRef.current = null; return null; }
    return next.value;
  }, []);

  const startGenerator = useCallback(() => {
    const algoFn = getPathfindingAlgorithm(algoId);
    if (!algoFn) return;
    const gridCopy = cloneGrid(grid);
    generatorRef.current = algoFn(gridCopy, startNode, endNode);
  }, [algoId, grid, startNode, endNode]);

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

  const totalCells = snapshot.context.rows * snapshot.context.cols;

  return (
    <div className="space-y-2">
      <PathfindingControlPanel
        onPlay={() => send({ type: "play" })}
        onPause={() => send({ type: "pause" })}
        onStep={() => send({ type: "step" })}
        onReset={() => { stopLoop(); generatorRef.current = null; send({ type: "reset" }); }}
        onSpeedChange={(s) => send({ type: "speedChange", speed: s })}
        onGenerateMaze={() => { stopLoop(); generatorRef.current = null; send({ type: "generateMaze" }); }}
        onSizeChange={(rows, cols) => { stopLoop(); generatorRef.current = null; send({ type: "sizeChange", rows, cols }); }}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        gridRows={snapshot.context.rows}
      />
      <VisualizerPanel>
        <GridVisualizer
          grid={grid}
          snapshot={pfSnapshot}
          onToggleWall={(r, c) => send({ type: "toggleWall", row: r, col: c })}
          onSetStart={(r, c) => send({ type: "setStart", row: r, col: c })}
          onSetEnd={(r, c) => send({ type: "setEnd", row: r, col: c })}
          disabled={isRunning || isDone}
        />
      </VisualizerPanel>
      <PathfindingStatsPanel
        cellsExplored={stats.cellsExplored}
        pathLength={stats.pathLength}
        wallCount={stats.wallCount}
        timeElapsed={stats.timeElapsed}
        totalCells={totalCells}
      />
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
