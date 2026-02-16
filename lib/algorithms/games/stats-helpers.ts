import { formatTime } from "@/lib/utils";
import type { GamesSnapshot } from "@/lib/types";

export interface StatCellData {
  label: string;
  value: string | number;
}

/** Pure function: builds the stat cells for any game snapshot. */
export function buildGamesStatCells(snapshot: GamesSnapshot | null): { cols: number; cells: StatCellData[] } {
  if (!snapshot) {
    return {
      cols: 4,
      cells: [
        { label: "Status", value: "—" },
        { label: "Steps", value: 0 },
        { label: "Progress", value: "—" },
        { label: "Time", value: formatTime(0) },
      ],
    };
  }

  switch (snapshot.type) {
    case "n-queen":
      return {
        cols: 4,
        cells: [
          { label: "Queens", value: `${snapshot.data.stats.queensPlaced}/${snapshot.data.board.length}` },
          { label: "Backtracks", value: snapshot.data.stats.backtracks },
          { label: "Solutions", value: snapshot.data.stats.solutionsFound },
          { label: "Time", value: formatTime(snapshot.data.stats.timeElapsed) },
        ],
      };
    case "sudoku":
      return {
        cols: 4,
        cells: [
          { label: "Filled", value: `${snapshot.data.stats.cellsFilled}/${snapshot.data.stats.totalCells}` },
          { label: "Backtracks", value: snapshot.data.stats.backtracks },
          { label: "Total Cells", value: snapshot.data.stats.totalCells },
          { label: "Time", value: formatTime(snapshot.data.stats.timeElapsed) },
        ],
      };
    case "game-of-life":
      return {
        cols: 4,
        cells: [
          { label: "Generation", value: snapshot.data.stats.generation },
          { label: "Alive", value: snapshot.data.stats.aliveCells },
          { label: "Total Cells", value: snapshot.data.stats.totalCells },
          { label: "Time", value: formatTime(snapshot.data.stats.timeElapsed) },
        ],
      };
    case "knight-tour":
      return {
        cols: 4,
        cells: [
          { label: "Visited", value: `${snapshot.data.stats.squaresVisited}/${snapshot.data.stats.totalSquares}` },
          { label: "Backtracks", value: snapshot.data.stats.backtracks },
          { label: "Total", value: snapshot.data.stats.totalSquares },
          { label: "Time", value: formatTime(snapshot.data.stats.timeElapsed) },
        ],
      };
    case "minimax":
      return {
        cols: 4,
        cells: [
          { label: "Evaluated", value: snapshot.data.stats.nodesEvaluated },
          { label: "Pruned", value: snapshot.data.stats.nodesPruned },
          { label: "Depth", value: snapshot.data.stats.treeDepth },
          { label: "Time", value: formatTime(snapshot.data.stats.timeElapsed) },
        ],
      };
  }
}
