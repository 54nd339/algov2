export const APP_VERSION = "v2.0.0";

/* ── Visualizer dimension constants ──────────────────────────────────── */

/** ReactFlow graph/MST node dimensions (px). */
export const GRAPH_NODE_SIZE = 44;

/** Pathfinding grid cell size (px). */
export const GRID_CELL_SIZE = 24;

/** Minimum bar width in sorting/searching visualizers (px). */
export const MIN_BAR_WIDTH = 2;

/** Minimax tree visualizer dimensions (px). */
export const MINIMAX_TREE = { height: 420, yPadding: 40, minWidth: 400 } as const;

/** Gap between pathfinding grid cells (px). */
export const GRID_GAP = 1;

/** Edge label font size in graph/MST visualizers (px). */
export const EDGE_LABEL_FONT_SIZE = 11;

/** Tailwind grid-cols classes keyed by column count (safe for tree-shaking). */
export const GRID_COLS: Record<number, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
};

/** Perceptron network visualizer dimensions (px). */
export const PERCEPTRON_NODE_SIZE = 40;
export const PERCEPTRON_LAYER_GAP = 180;
export const PERCEPTRON_NEURON_GAP = 60;

/** Board cell sizes for game variants (px). */
export const BOARD_CELL_SIZES = {
  life: 16,
  sudoku: 40,
  small: 56,   // maxDim <= 6
  medium: 44,  // maxDim <= 8
  large: 36,   // maxDim <= 12
  xlarge: 28,  // maxDim > 12
} as const;
