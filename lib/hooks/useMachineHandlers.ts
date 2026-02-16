"use client";

import { useCallback } from "react";

/**
 * Returns stable callbacks for the common play/pause/step/reset/speed
 * machine events so page components don't recreate handlers every render.
 */
export function useMachineHandlers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each machine has its own event union; a generic `any` avoids coupling this hook to every machine type
  send: (event: any) => void,
  clearLoop: () => void,
) {
  const onPlay = useCallback(() => send({ type: "play" }), [send]);
  const onPause = useCallback(() => send({ type: "pause" }), [send]);
  const onStep = useCallback(() => send({ type: "step" }), [send]);
  const onSpeedChange = useCallback((speed: number) => send({ type: "speedChange", speed }), [send]);

  const onReset = useCallback(() => {
    clearLoop();
    send({ type: "reset" });
  }, [clearLoop, send]);

  return { onPlay, onPause, onStep, onReset, onSpeedChange };
}
