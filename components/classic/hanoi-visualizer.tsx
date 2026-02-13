"use client";

import type { HanoiSnapshot } from "@/lib/types/classic";

/* ── Peg colors ────────────────────────────────────────────────── */

const DISC_COLORS = [
  "var(--algo-green)",
  "var(--algo-cyan)",
  "var(--algo-purple)",
  "var(--algo-yellow)",
  "var(--algo-red)",
  "var(--algo-blue)",
  "var(--algo-green)",
  "var(--algo-cyan)",
];

const PEG_WIDTH = 6;
const PEG_COLOR = "var(--muted-foreground)";
const BASE_HEIGHT = 8;

interface HanoiVisualizerProps {
  snapshot: HanoiSnapshot | null;
  discCount: number;
}

export function HanoiVisualizer({ snapshot, discCount }: HanoiVisualizerProps) {
  if (!snapshot) {
    return (
      <div className="flex h-full w-full items-center justify-center font-space text-muted-foreground">
        Press Play to start
      </div>
    );
  }

  const { pegs, activeDisc } = snapshot;
  const maxDiscs = discCount;
  const discHeight = Math.max(16, Math.min(32, 200 / maxDiscs));
  const pegHeight = (maxDiscs + 1) * discHeight + BASE_HEIGHT;
  const pegSpacing = 220;
  const totalWidth = pegSpacing * 3;
  const svgHeight = pegHeight + 40;

  function getDiscWidth(size: number): number {
    const minW = 30;
    const maxW = pegSpacing - 20;
    return minW + ((maxW - minW) * size) / maxDiscs;
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
      <svg
        viewBox={`0 0 ${totalWidth} ${svgHeight}`}
        className="max-h-full max-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {pegs.map((peg, pegIdx) => {
          const cx = pegSpacing * pegIdx + pegSpacing / 2;
          const baseY = svgHeight - 20;

          return (
            <g key={peg.name}>
              {/* Base */}
              <rect
                x={cx - pegSpacing / 2 + 10}
                y={baseY}
                width={pegSpacing - 20}
                height={BASE_HEIGHT}
                rx={3}
                fill={PEG_COLOR}
                opacity={0.3}
              />

              {/* Peg pole */}
              <rect
                x={cx - PEG_WIDTH / 2}
                y={baseY - pegHeight + BASE_HEIGHT}
                width={PEG_WIDTH}
                height={pegHeight - BASE_HEIGHT}
                rx={2}
                fill={PEG_COLOR}
                opacity={0.4}
              />

              {/* Peg label */}
              <text
                x={cx}
                y={svgHeight - 4}
                textAnchor="middle"
                fill="currentColor"
                fontSize={12}
                fontFamily="var(--font-space)"
                className="fill-muted-foreground"
              >
                {peg.name}
              </text>

              {/* Discs (bottom-up: last in array = bottom) */}
              {[...peg.discs].reverse().map((disc, stackIdx) => {
                const w = getDiscWidth(disc.size);
                const y = baseY - (stackIdx + 1) * discHeight;
                const isActive = disc.id === activeDisc;

                return (
                  <rect
                    key={disc.id}
                    x={cx - w / 2}
                    y={y}
                    width={w}
                    height={discHeight - 2}
                    rx={4}
                    fill={DISC_COLORS[(disc.id - 1) % DISC_COLORS.length]}
                    opacity={isActive ? 1 : 0.8}
                    stroke={isActive ? "var(--algo-green)" : "none"}
                    strokeWidth={isActive ? 2 : 0}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
