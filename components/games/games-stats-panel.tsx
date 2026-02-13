import type { GamesSnapshot } from "@/lib/types/games";

interface GamesStatsPanelProps {
  snapshot: GamesSnapshot | null;
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 border border-border/30 bg-card/50 px-3 py-2">
      <span className="font-space text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-space text-lg font-bold text-algo-green">
        {value}
      </span>
    </div>
  );
}

export function GamesStatsPanel({ snapshot }: GamesStatsPanelProps) {
  if (!snapshot) {
    return (
      <div className="grid grid-cols-4 gap-px">
        <StatCell label="Status" value="—" />
        <StatCell label="Steps" value={0} />
        <StatCell label="Progress" value="—" />
        <StatCell label="Time" value={formatTime(0)} />
      </div>
    );
  }

  switch (snapshot.type) {
    case "n-queen":
      return (
        <div className="grid grid-cols-4 gap-px">
          <StatCell label="Queens" value={`${snapshot.data.stats.queensPlaced}/${snapshot.data.board.length}`} />
          <StatCell label="Backtracks" value={snapshot.data.stats.backtracks} />
          <StatCell label="Solutions" value={snapshot.data.stats.solutionsFound} />
          <StatCell label="Time" value={formatTime(snapshot.data.stats.timeElapsed)} />
        </div>
      );
    case "sudoku":
      return (
        <div className="grid grid-cols-4 gap-px">
          <StatCell label="Filled" value={`${snapshot.data.stats.cellsFilled}/${snapshot.data.stats.totalCells}`} />
          <StatCell label="Backtracks" value={snapshot.data.stats.backtracks} />
          <StatCell label="Total Cells" value={snapshot.data.stats.totalCells} />
          <StatCell label="Time" value={formatTime(snapshot.data.stats.timeElapsed)} />
        </div>
      );
    case "game-of-life":
      return (
        <div className="grid grid-cols-4 gap-px">
          <StatCell label="Generation" value={snapshot.data.stats.generation} />
          <StatCell label="Alive" value={snapshot.data.stats.aliveCells} />
          <StatCell label="Total Cells" value={snapshot.data.stats.totalCells} />
          <StatCell label="Time" value={formatTime(snapshot.data.stats.timeElapsed)} />
        </div>
      );
    case "knight-tour":
      return (
        <div className="grid grid-cols-4 gap-px">
          <StatCell label="Visited" value={`${snapshot.data.stats.squaresVisited}/${snapshot.data.stats.totalSquares}`} />
          <StatCell label="Backtracks" value={snapshot.data.stats.backtracks} />
          <StatCell label="Total" value={snapshot.data.stats.totalSquares} />
          <StatCell label="Time" value={formatTime(snapshot.data.stats.timeElapsed)} />
        </div>
      );
    case "minimax":
      return (
        <div className="grid grid-cols-4 gap-px">
          <StatCell label="Evaluated" value={snapshot.data.stats.nodesEvaluated} />
          <StatCell label="Pruned" value={snapshot.data.stats.nodesPruned} />
          <StatCell label="Depth" value={snapshot.data.stats.treeDepth} />
          <StatCell label="Time" value={formatTime(snapshot.data.stats.timeElapsed)} />
        </div>
      );
  }
}
