import type { ClassicSnapshot, HanoiPeg, HanoiDisc } from "@/lib/types";

/* ── Tower of Hanoi (Recursive) ──────────────────────────────────── */

function makePegs(n: number): HanoiPeg[] {
  const discs: HanoiDisc[] = Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    size: i + 1,
  }));
  return [
    { name: "A", discs: [...discs] },
    { name: "B", discs: [] },
    { name: "C", discs: [] },
  ];
}

function clonePegs(pegs: HanoiPeg[]): HanoiPeg[] {
  return pegs.map((p) => ({
    name: p.name,
    discs: p.discs.map((d) => ({ ...d })),
  }));
}

export function* towerOfHanoi(n: number): Generator<ClassicSnapshot> {
  const pegs = makePegs(n);
  const totalMoves = (1 << n) - 1;
  let movesMade = 0;
  const startTime = performance.now();

  /* Yield starting configuration so the UI can render before any moves */
  yield {
    type: "tower-of-hanoi",
    data: {
      pegs: clonePegs(pegs),
      activeDisc: null,
      sourcePeg: null,
      targetPeg: null,
      stats: { movesMade, totalMoves, timeElapsed: 0 },
    },
  };

  function* move(
    count: number,
    from: number,
    to: number,
    aux: number,
  ): Generator<ClassicSnapshot> {
    if (count === 0) return;

    yield* move(count - 1, from, aux, to);

    const disc = pegs[from].discs.shift()!;
    pegs[to].discs.unshift(disc);
    movesMade++;

    yield {
      type: "tower-of-hanoi",
      data: {
        pegs: clonePegs(pegs),
        activeDisc: disc.id,
        sourcePeg: from,
        targetPeg: to,
        stats: { movesMade, totalMoves, timeElapsed: Math.round(performance.now() - startTime) },
      },
    };

    yield* move(count - 1, aux, to, from);
  }

  yield* move(n, 0, 2, 1);
}
