import { assign } from "xstate";

/* eslint-disable @typescript-eslint/no-explicit-any -- XState machine configs require generic context/event shapes that vary per visualizer, making strict typing impractical here */
interface VisualizerStatesConfig {
  /** Partial context returned on reset from idle & done (full regeneration). */
  onReset: (ctx: any) => Record<string, any>;

  /** Partial context returned on reset mid-play (running/paused/stepping).
   *  Defaults to `onReset` if not provided. */
  onPlayReset?: (ctx: any) => Record<string, any>;

  /** Partial context returned on "generate" from done.
   *  Defaults to `onReset` if not provided. */
  onGenerate?: (ctx: any) => Record<string, any>;

  /** Extract snapshot (and optionally stats) from an updateSnapshot event.
   *  Must also increment stepIndex. */
  onSnapshot: (event: any, ctx: any) => Record<string, any>;

  /** If true, idle state accepts updateSnapshot for initial-state preview.
   *  The idle handler only sets `snapshot` (no stepIndex increment). */
  idleAcceptsSnapshot?: boolean;

  /** Extra transition map merged into idle.on (e.g. generateMaze, clearWalls). */
  extraIdleOn?: Record<string, any>;

  /** Extra transition map merged into done.on (e.g. generateMaze, clearWalls). */
  extraDoneOn?: Record<string, any>;
}

/**
 * Build the five shared visualizer states.
 * Pass the result as `states` in your `setup().createMachine({ ... })` call.
 */
export function visualizerStates(cfg: VisualizerStatesConfig) {
  const playReset = cfg.onPlayReset ?? cfg.onReset;
  const genReset = cfg.onGenerate ?? cfg.onReset;

  const snapshotAction = {
    actions: assign(({ event, context }: any) => cfg.onSnapshot(event, context)),
  };

  const steppingSnapshotAction = {
    target: "paused" as const,
    actions: assign(({ event, context }: any) => cfg.onSnapshot(event, context)),
  };

  /* Idle preview: only sets snapshot, no stepIndex increment */
  const idleSnapshotAction = {
    actions: assign(({ event }: any) => ({
      snapshot: "snapshot" in event ? event.snapshot : null,
    })),
  };

  const makeReset = (fn: (ctx: any) => Record<string, any>, target?: string) => ({
    ...(target ? { target } : {}),
    actions: assign(({ context }: any) => fn(context)),
  });

  return {
    idle: {
      on: {
        play: "running",
        step: "stepping",
        reset: makeReset(cfg.onReset),
        ...(cfg.idleAcceptsSnapshot ? { updateSnapshot: idleSnapshotAction } : {}),
        ...cfg.extraIdleOn,
      },
    },
    running: {
      on: {
        pause: "paused",
        reset: makeReset(playReset, "idle"),
        updateSnapshot: snapshotAction,
        done: "done",
      },
    },
    paused: {
      on: {
        play: "running",
        step: "stepping",
        reset: makeReset(playReset, "idle"),
      },
    },
    stepping: {
      on: {
        updateSnapshot: steppingSnapshotAction,
        play: "running",
        reset: makeReset(playReset, "idle"),
      },
    },
    done: {
      on: {
        reset: makeReset(cfg.onReset, "idle"),
        generate: makeReset(genReset, "idle"),
        ...cfg.extraDoneOn,
      },
    },
  };
}
