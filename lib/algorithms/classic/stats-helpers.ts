import { formatTime } from "@/lib/utils";
import type { ClassicSnapshot } from "@/lib/types";
import type { StatCellData } from "@/lib/algorithms/games";

/** Pure function: builds the stat cells for any classic algorithm snapshot. */
export function buildClassicStatCells(snapshot: ClassicSnapshot | null): { cols: number; cells: StatCellData[] } {
  if (!snapshot) {
    return {
      cols: 3,
      cells: [
        { label: "Moves", value: 0 },
        { label: "Total", value: "—" },
        { label: "Time", value: formatTime(0) },
      ],
    };
  }

  switch (snapshot.type) {
    case "tower-of-hanoi":
      return {
        cols: 3,
        cells: [
          { label: "Moves", value: `${snapshot.data.stats.movesMade}/${snapshot.data.stats.totalMoves}` },
          { label: "Total", value: snapshot.data.stats.totalMoves },
          { label: "Time", value: formatTime(snapshot.data.stats.timeElapsed) },
        ],
      };
  }
}
