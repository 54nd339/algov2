import { useCallback, useEffect, type MutableRefObject } from "react";

interface UseInitialPreviewOptions<TSnapshot> {
  generatorRef: MutableRefObject<Generator<TSnapshot> | null>;
  send: (event: { type: "updateSnapshot"; snapshot: TSnapshot }) => void;
  /** Stable factory that returns a fresh generator for the algorithm. */
  createGenerator: () => Generator<TSnapshot> | null;
}

/**
 * Runs the generator once on mount (and whenever createGenerator changes)
 * to preview the first frame, so the visualizer isn't blank before play.
 *
 * Returns a stable `showInitialState` callback for use in reset handlers.
 */
export function useInitialPreview<TSnapshot>({
  generatorRef,
  send,
  createGenerator,
}: UseInitialPreviewOptions<TSnapshot>) {
  const showInitialState = useCallback(() => {
    generatorRef.current = null;
    const gen = createGenerator();
    if (!gen) return;
    const first = gen.next();
    if (!first.done && first.value) {
      generatorRef.current = gen;
      send({ type: "updateSnapshot", snapshot: first.value });
    }
    // generatorRef is a stable ref — intentionally excluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createGenerator, send]);

  useEffect(() => {
    showInitialState();
  }, [showInitialState]);

  return showInitialState;
}
