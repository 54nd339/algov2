"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Algorithm } from "@/config/algorithms";
import { useGamesMachine } from "@/lib/hooks/useGamesMachine";
import { getGamesAlgorithm } from "@/lib/algorithms/registry";
import { VisualizerPanel } from "@/components/common/visualizer-panel";
import { BoardVisualizer } from "@/components/games/board-visualizer";
import { MinimaxVisualizer } from "@/components/games/minimax-visualizer";
import { GamesControlPanel } from "@/components/games/games-control-panel";
import { GamesStatsPanel } from "@/components/games/games-stats-panel";
import { AlgoInfoSection } from "@/components/visualizer/algo-info-section";
import type { GamesSnapshot, BoardCell, CellStatus } from "@/lib/types/games";

interface GamesPageProps {
  algoId: string;
  algorithm: Algorithm;
}

const GAMES_SIZE_CONFIG: Record<string, { label: string; min: number; max: number; step: number }> = {
  "n-queen": { label: "N", min: 4, max: 12, step: 1 },
  "sudoku": { label: "Size", min: 4, max: 9, step: 5 },
  "game-of-life": { label: "Grid", min: 10, max: 40, step: 2 },
  "knight-tour": { label: "N", min: 5, max: 8, step: 1 },
  "minimax": { label: "Depth", min: 2, max: 5, step: 1 },
};

const GAMES_VARIANT: Record<string, "queen" | "sudoku" | "life" | "knight"> = {
  "n-queen": "queen",
  "sudoku": "sudoku",
  "game-of-life": "life",
  "knight-tour": "knight",
};

export function GamesPage({ algoId, algorithm }: GamesPageProps) {
  const { snapshot, send } = useGamesMachine(algoId);
  const [branchingFactor, setBranchingFactor] = useState(3);

  const generatorRef = useRef<Generator<GamesSnapshot> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const isRunning = snapshot.matches("running");
  const isStepping = snapshot.matches("stepping");
  const isDone = snapshot.matches("done");
  const speed = snapshot.context.speed;
  const boardSize = snapshot.context.boardSize;
  const gamesSnapshot = snapshot.context.snapshot;

  const sizeConfig = GAMES_SIZE_CONFIG[algoId] ?? { label: "Size", min: 4, max: 12, step: 1 };

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  const runStep = useCallback((): GamesSnapshot | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) { generatorRef.current = null; return null; }
    return next.value;
  }, []);

  // Build options from current snapshot for interactive boards
  const buildOptions = useCallback(() => {
    const options: { initialBoard?: BoardCell[][]; startRow?: number; startCol?: number; branching?: number } = {};
    if (algoId === "game-of-life" && gamesSnapshot?.type === "game-of-life") {
      options.initialBoard = gamesSnapshot.data.board;
    }
    if (algoId === "knight-tour" && gamesSnapshot?.type === "knight-tour") {
      options.startRow = gamesSnapshot.data.currentRow;
      options.startCol = gamesSnapshot.data.currentCol;
    }
    if (algoId === "minimax") {
      options.branching = branchingFactor;
    }
    return options;
  }, [algoId, gamesSnapshot, branchingFactor]);

  const startGenerator = useCallback(() => {
    const algoFn = getGamesAlgorithm(algoId);
    if (!algoFn) return;
    generatorRef.current = algoFn(boardSize, buildOptions());
  }, [algoId, boardSize, buildOptions]);

  // Show initial state on mount and when size/algo changes
  const showInitialState = useCallback(() => {
    generatorRef.current = null;
    const algoFn = getGamesAlgorithm(algoId);
    if (!algoFn) return;
    const opts = algoId === "minimax" ? { branching: branchingFactor } : undefined;
    const gen = algoFn(boardSize, opts);
    const first = gen.next();
    if (!first.done && first.value) {
      generatorRef.current = gen;
      send({ type: "updateSnapshot", snapshot: first.value });
    }
  }, [algoId, boardSize, send, branchingFactor]);

  useEffect(() => {
    showInitialState();
  }, [showInitialState]);

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

  // Interactive cell click handler (idle/paused only)
  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning || isDone) return;
    if (!gamesSnapshot) return;

    if (algoId === "game-of-life" && gamesSnapshot.type === "game-of-life") {
      const newBoard = gamesSnapshot.data.board.map((r) => r.map((c) => ({ ...c })));
      const cell = newBoard[row][col];
      cell.value = cell.value === 1 ? 0 : 1;
      cell.status = cell.value === 1 ? "alive" : "dead";
      const aliveCells = newBoard.flat().filter((c) => c.value === 1).length;
      generatorRef.current = null;
      send({
        type: "updateSnapshot",
        snapshot: {
          type: "game-of-life",
          data: {
            ...gamesSnapshot.data,
            board: newBoard,
            stats: { ...gamesSnapshot.data.stats, aliveCells },
          },
        },
      });
    }

    if (algoId === "knight-tour" && gamesSnapshot.type === "knight-tour") {
      const n = gamesSnapshot.data.board.length;
      const newBoard = Array.from({ length: n }, (_, r) =>
        Array.from({ length: n }, (_, c) => ({
          row: r, col: c, value: 0, status: "empty" as CellStatus,
        })),
      );
      newBoard[row][col].value = 1;
      newBoard[row][col].status = "placed";
      generatorRef.current = null;
      send({
        type: "updateSnapshot",
        snapshot: {
          type: "knight-tour",
          data: {
            ...gamesSnapshot.data,
            board: newBoard,
            currentRow: row,
            currentCol: col,
            stats: { ...gamesSnapshot.data.stats, squaresVisited: 1, backtracks: 0 },
          },
        },
      });
    }
  }, [algoId, gamesSnapshot, isRunning, isDone, send]);

  const isMinimax = algoId === "minimax";
  const hideGenerate = algoId === "n-queen" || algoId === "knight-tour";

  return (
    <div className="space-y-2">
      <GamesControlPanel
        onPlay={() => send({ type: "play" })}
        onPause={() => send({ type: "pause" })}
        onStep={() => send({ type: "step" })}
        onReset={() => { stopLoop(); generatorRef.current = null; send({ type: "reset" }); showInitialState(); }}
        onSpeedChange={(s) => send({ type: "speedChange", speed: s })}
        onBoardSizeChange={(s) => { stopLoop(); generatorRef.current = null; send({ type: "boardSizeChange", size: s }); }}
        onGenerate={() => { stopLoop(); send({ type: "reset" }); showInitialState(); }}
        isRunning={isRunning}
        isDone={isDone}
        speed={speed}
        boardSize={boardSize}
        sizeLabel={sizeConfig.label}
        sizeMin={sizeConfig.min}
        sizeMax={sizeConfig.max}
        sizeStep={sizeConfig.step}
        branchingFactor={branchingFactor}
        onBranchingChange={(b) => { stopLoop(); generatorRef.current = null; setBranchingFactor(b); }}
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
            boxSize={algoId === "sudoku" ? Math.floor(Math.sqrt(boardSize)) : undefined}
            onCellClick={!isRunning && !isDone ? handleCellClick : undefined}
          />
        )}
      </VisualizerPanel>
      <GamesStatsPanel snapshot={gamesSnapshot} />
      <AlgoInfoSection algorithm={algorithm} />
    </div>
  );
}
