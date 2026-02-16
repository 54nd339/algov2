"use client";

import { useCallback, useState } from "react";
import type { Algorithm } from "@/config";
import { useGamesMachine, useAnimationLoop, useMachineHandlers, useInitialPreview } from "@/lib/hooks";
import { getAlgorithm } from "@/lib/algorithms";
import { VisualizerPanel } from "@/components/common";
import { BoardVisualizer, MinimaxVisualizer, GamesControlPanel, GamesStatsPanel } from "@/components/games";
import { AlgoInfoSection } from "../algo-info-section";
import type { GamesSnapshot, GamesAlgorithmFn } from "@/lib/types";
import { toggleLifeCell, setKnightStart, GAMES_SIZE_CONFIG, GAMES_VARIANT, sudokuBoxSize, buildGameOptions } from "@/lib/algorithms/games";

interface GamesPageProps {
  algoId: string;
  algorithm: Algorithm;
}

export function GamesPage({ algoId, algorithm }: GamesPageProps) {
  const { snapshot, send, state } = useGamesMachine(algoId);
  const [branchingFactor, setBranchingFactor] = useState(3);

  const isRunning = state === "running";
  const isStepping = state === "stepping";
  const isDone = state === "done";
  const speed = snapshot.context.speed;
  const boardSize = snapshot.context.boardSize;
  const gamesSnapshot = snapshot.context.snapshot;

  const sizeConfig = GAMES_SIZE_CONFIG[algoId] ?? { label: "Size", min: 4, max: 12, step: 1 };

  const createGenerator = useCallback(() => {
    const algoFn = getAlgorithm<GamesAlgorithmFn>("games", algoId);
    if (!algoFn) return null;
    return algoFn(boardSize, buildGameOptions(algoId, gamesSnapshot, branchingFactor));
  }, [algoId, boardSize, gamesSnapshot, branchingFactor]);

  /** Preview generator uses minimal options (no board state needed). */
  const createPreviewGenerator = useCallback(() => {
    const algoFn = getAlgorithm<GamesAlgorithmFn>("games", algoId);
    if (!algoFn) return null;
    const opts = algoId === "minimax" ? { branching: branchingFactor } : undefined;
    return algoFn(boardSize, opts);
  }, [algoId, boardSize, branchingFactor]);

  const onSnapshot = useCallback(
    (step: GamesSnapshot) => send({ type: "updateSnapshot", snapshot: step }),
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

  const showInitialState = useInitialPreview<GamesSnapshot>({
    generatorRef,
    send,
    createGenerator: createPreviewGenerator,
  });

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning || isDone || !gamesSnapshot) return;

    let newSnapshot: GamesSnapshot | null = null;
    if (algoId === "game-of-life" && gamesSnapshot.type === "game-of-life") {
      newSnapshot = toggleLifeCell(gamesSnapshot, row, col);
    } else if (algoId === "knight-tour" && gamesSnapshot.type === "knight-tour") {
      newSnapshot = setKnightStart(gamesSnapshot, row, col);
    }
    if (newSnapshot) {
      generatorRef.current = null;
      send({ type: "updateSnapshot", snapshot: newSnapshot });
    }
    // generatorRef is a stable ref — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId, gamesSnapshot, isRunning, isDone, send]);

  const { onPlay, onPause, onStep, onSpeedChange } = useMachineHandlers(send, clearLoop);
  const onGamesReset = useCallback(() => { clearLoop(); send({ type: "reset" }); showInitialState(); }, [clearLoop, send, showInitialState]);
  const onBoardSizeChange = useCallback((s: number) => { clearLoop(); send({ type: "boardSizeChange", size: s }); }, [clearLoop, send]);
  const onBranchingChange = useCallback((b: number) => { clearLoop(); setBranchingFactor(b); }, [clearLoop]);

  const isMinimax = algoId === "minimax";
  const hideGenerate = algoId === "n-queen" || algoId === "knight-tour";

  return (
    <div className="space-y-2">
      <GamesControlPanel
        onPlay={onPlay}
        onPause={onPause}
        onStep={onStep}
        onReset={onGamesReset}
        onSpeedChange={onSpeedChange}
        onBoardSizeChange={onBoardSizeChange}
        onGenerate={onGamesReset}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        boardSize={boardSize}
        sizeLabel={sizeConfig.label}
        sizeMin={sizeConfig.min}
        sizeMax={sizeConfig.max}
        sizeStep={sizeConfig.step}
        branchingFactor={branchingFactor}
        onBranchingChange={onBranchingChange}
        showBranching={isMinimax}
        showGenerate={!hideGenerate}
      />
      <VisualizerPanel showGrid={false}>
        {isMinimax ? (
          <MinimaxVisualizer
            snapshot={gamesSnapshot?.type === "minimax" ? gamesSnapshot.data : null}
          />
        ) : (
          <BoardVisualizer
            board={
              gamesSnapshot && gamesSnapshot.type !== "minimax"
                ? gamesSnapshot.data.board
                : null
            }
            variant={GAMES_VARIANT[algoId] ?? "queen"}
            boxSize={sudokuBoxSize(algoId, boardSize)}
            onCellClick={!isRunning && !isDone ? handleCellClick : undefined}
          />
        )}
      </VisualizerPanel>
      <GamesStatsPanel snapshot={gamesSnapshot} />
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
