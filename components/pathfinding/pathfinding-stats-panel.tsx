interface PathfindingStatsPanelProps {
  cellsExplored: number;
  pathLength: number;
  wallCount: number;
  timeElapsed: number;
  totalCells: number;
}

export function PathfindingStatsPanel({
  cellsExplored,
  pathLength,
  wallCount,
  timeElapsed,
  totalCells,
}: PathfindingStatsPanelProps) {
  return (
    <div className="grid grid-cols-4 font-space uppercase">
      <StatCell
        label="Cells Explored"
        value={cellsExplored}
        borderColor="border-b-algo-blue"
        textColor="text-algo-blue"
      />
      <StatCell
        label="Path Length"
        value={pathLength}
        borderColor="border-b-algo-yellow"
        textColor="text-algo-yellow"
      />
      <StatCell
        label="Walls"
        value={wallCount}
        borderColor="border-b-algo-red"
        textColor="text-algo-red"
        total={totalCells}
      />
      <StatCell
        label="Time"
        value={`${timeElapsed}ms`}
        borderColor="border-b-algo-purple"
        textColor="text-algo-purple"
      />
    </div>
  );
}

function StatCell({
  label,
  value,
  borderColor,
  textColor,
  total,
}: {
  label: string;
  value: number | string;
  borderColor: string;
  textColor: string;
  total?: number;
}) {
  return (
    <div
      className={`border-b-[8px] ${borderColor} border-r border-r-border bg-card px-3 py-3 last:border-r-0`}
    >
      <p className="text-[10px] tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`text-2xl font-bold ${textColor}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {total !== undefined && (
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          / {total}
        </p>
      )}
    </div>
  );
}
