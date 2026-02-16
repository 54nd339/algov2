"use client";

import { useCallback } from "react";
import type { Algorithm } from "@/config";
import { usePathfindingMachine, useAnimationLoop, useMachineHandlers } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { cloneGrid } from "@/lib/algorithms/pathfinding";
import { VisualizerPanel } from "@/components/common";
import { PathfindingControlPanel, PathfindingStatsPanel, GridVisualizer } from "@/components/pathfinding";
import { AlgoInfoSection } from "../algo-info-section";
import type { PathfindingSnapshot, PathfindingAlgorithmFn } from "@/lib/types";

interface PathfindingPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function PathfindingPage({ algoId, algorithm }: PathfindingPageProps) {
  const { snapshot, send, state } = usePathfindingMachine(algoId);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const grid = snapshot.context.grid;
  const speed = snapshot.context.speed;
  const stats = snapshot.context.stats;
  const pfSnapshot = snapshot.context.snapshot;
  const startNode = snapshot.context.startNode;
  const endNode = snapshot.context.endNode;

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm<PathfindingAlgorithmFn>("path-finding", algoId);
    if (!algoFn) return null;
    return algoFn(cloneGrid(grid), startNode, endNode);
  }, [algoId, grid, startNode, endNode]);

  const onSnapshot = useCallback(
    (step: PathfindingSnapshot) => send({ type: "updateSnapshot", snapshot: step }),
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
  const onGenerateMaze = useCallback(() => { clearLoop(); send({ type: "generateMaze" }); }, [clearLoop, send]);
  const onSizeChange = useCallback((rows: number, cols: number) => { clearLoop(); send({ type: "sizeChange", rows, cols }); }, [clearLoop, send]);

  const onToggleWall = useCallback((r: number, c: number) => send({ type: "toggleWall", row: r, col: c }), [send]);
  const onSetStart = useCallback((r: number, c: number) => send({ type: "setStart", row: r, col: c }), [send]);
  const onSetEnd = useCallback((r: number, c: number) => send({ type: "setEnd", row: r, col: c }), [send]);

  const totalCells = snapshot.context.rows * snapshot.context.cols;

  return (
    <div className="space-y-2">
      <PathfindingControlPanel
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
        onGenerateMaze={onGenerateMaze}
        onSizeChange={onSizeChange}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        gridRows={snapshot.context.rows}
      />
      <VisualizerPanel>
        <GridVisualizer
          grid={grid}
          snapshot={pfSnapshot}
          onToggleWall={onToggleWall}
          onSetStart={onSetStart}
          onSetEnd={onSetEnd}
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
