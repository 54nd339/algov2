/** Colour cycle for disc fill. */
export const DISC_COLORS = [
  "var(--algo-green)",
  "var(--algo-cyan)",
  "var(--algo-purple)",
  "var(--algo-yellow)",
  "var(--algo-red)",
  "var(--algo-blue)",
  "var(--algo-green)",
  "var(--algo-cyan)",
];

export const PEG_WIDTH = 6;
export const PEG_COLOR = "var(--muted-foreground)";
export const BASE_HEIGHT = 8;

/** Scale disc width proportionally between minW and maxW. */
export function getDiscWidth(size: number, maxDiscs: number, pegSpacing: number): number {
  const minW = 30;
  const maxW = pegSpacing - 20;
  return minW + ((maxW - minW) * size) / maxDiscs;
}

/** Derive all SVG dimensions from disc count. */
export function hanoiLayout(maxDiscs: number) {
  const discHeight = Math.max(16, Math.min(32, 200 / maxDiscs));
  const pegSpacing = 220;
  const pegHeight = (maxDiscs + 1) * discHeight + BASE_HEIGHT;
  const totalWidth = pegSpacing * 3;
  const svgHeight = pegHeight + 40;
  return { discHeight, pegSpacing, pegHeight, totalWidth, svgHeight };
}
