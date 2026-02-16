"use client";

import { useCallback, useEffect, useRef } from "react";

interface AnimationLoopOptions<T> {
  isRunning: boolean;
  isStepping: boolean;
  isIdle: boolean;
  speed: number;
  createGenerator: () => Generator<T> | null;
  onSnapshot: (snapshot: T) => void;
  onDone: () => void;
}

/**
 * Centralised RAF-based animation loop shared by all visualizer pages.
 * Returns `stopLoop` and `generatorRef` so the page can imperatively
 * reset or replace the generator (e.g. on reset / generate).
 */
export function useAnimationLoop<T>({
  isRunning,
  isStepping,
  isIdle,
  speed,
  createGenerator,
  onSnapshot,
  onDone,
}: AnimationLoopOptions<T>) {
  const generatorRef = useRef<Generator<T> | null>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const runStep = useCallback((): T | null => {
    if (!generatorRef.current) return null;
    const next = generatorRef.current.next();
    if (next.done) {
      generatorRef.current = null;
      return null;
    }
    return next.value;
  }, []);

  // Drive the generator forward at `speed` frames/sec via requestAnimationFrame
  useEffect(() => {
    if (!isRunning) return;
    if (!generatorRef.current) {
      generatorRef.current = createGenerator();
    }
    cancelledRef.current = false;
    let lastTime = 0;
    const msPerFrame = 1000 / speed;

    const tick = (timestamp: number) => {
      if (cancelledRef.current) return;
      if (timestamp - lastTime >= msPerFrame) {
        lastTime = timestamp;
        const step = runStep();
        if (step) onSnapshot(step);
        else {
          onDone();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => stopLoop();
  }, [isRunning, speed, createGenerator, onSnapshot, onDone, runStep, stopLoop]);

  // Advance exactly one generator step when the user clicks "step"
  useEffect(() => {
    if (!isStepping) return;
    if (!generatorRef.current) {
      generatorRef.current = createGenerator();
    }
    const step = runStep();
    if (step) onSnapshot(step);
    else onDone();
  }, [isStepping, createGenerator, onSnapshot, onDone, runStep]);

  // Discard the generator on idle so a fresh one is created on next play
  useEffect(() => {
    if (isIdle && generatorRef.current) {
      stopLoop();
      generatorRef.current = null;
    }
  }, [isIdle, stopLoop]);

  /** Stop the RAF loop and discard the current generator. */
  const clearLoop = useCallback(() => {
    stopLoop();
    generatorRef.current = null;
  }, [stopLoop]);

  return { generatorRef, stopLoop, clearLoop };
}
