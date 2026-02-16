import type { HanoiSnapshot } from "@/lib/types";
import { ScrollArea } from "@/components/ui";
import { EmptyVisualizerState } from "@/components/common";
import {
  DISC_COLORS,
  PEG_WIDTH,
  PEG_COLOR,
  BASE_HEIGHT,
  getDiscWidth,
  hanoiLayout,
} from "@/lib/algorithms/classic";

interface HanoiVisualizerProps {
  snapshot: HanoiSnapshot | null;
  discCount: number;
}

export function HanoiVisualizer({ snapshot, discCount }: HanoiVisualizerProps) {
  if (!snapshot) {
    return <EmptyVisualizerState />;
  }

  const { pegs, activeDisc } = snapshot;
  const maxDiscs = discCount;
  const { discHeight, pegSpacing, pegHeight, totalWidth, svgHeight } = hanoiLayout(maxDiscs);

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex items-center justify-center p-4">
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

              {/* Reversed so last disc in array renders at bottom of peg */}
              {[...peg.discs].reverse().map((disc, stackIdx) => {
                const w = getDiscWidth(disc.size, maxDiscs, pegSpacing);
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
    </ScrollArea>
  );
}
