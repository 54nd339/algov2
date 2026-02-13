export interface HanoiDisc {
  id: number;        // 1 = smallest, n = largest
  size: number;      // width proportional to size
}

export interface HanoiPeg {
  name: string;      // "A" | "B" | "C"
  discs: HanoiDisc[];
}

export interface HanoiStats {
  movesMade: number;
  totalMoves: number; // 2^n - 1
  timeElapsed: number;
}

export interface HanoiSnapshot {
  pegs: HanoiPeg[];
  activeDisc: number | null;      // disc id being moved
  sourcePeg: number | null;       // peg index
  targetPeg: number | null;       // peg index
  stats: HanoiStats;
}

export type ClassicSnapshot =
  | { type: "tower-of-hanoi"; data: HanoiSnapshot };

export interface ClassicContext {
  speed: number;
  stepIndex: number;
  snapshot: ClassicSnapshot | null;
  discCount: number;
}

export type ClassicEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "generate" }
  | { type: "speedChange"; speed: number }
  | { type: "discCountChange"; count: number }
  | { type: "updateSnapshot"; snapshot: ClassicSnapshot };

export type ClassicAlgorithmFn = (
  discCount: number,
) => Generator<ClassicSnapshot>;
