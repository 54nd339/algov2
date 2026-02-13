interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  accesses: number;
  timeElapsed: number;
  total: number;
}

export function StatsPanel({
  comparisons,
  swaps,
  accesses,
  timeElapsed,
  total,
}: StatsPanelProps) {
  return (
    <div className="grid grid-cols-4 font-space uppercase">
      <StatCell
        label="Comparisons"
        value={comparisons}
        borderColor="border-b-algo-cyan"
        textColor="text-algo-cyan"
      />
      <StatCell
        label="Swaps"
        value={swaps}
        borderColor="border-b-algo-green"
        textColor="text-algo-green"
      />
      <StatCell
        label="Array Accesses"
        value={accesses}
        borderColor="border-b-algo-yellow"
        textColor="text-algo-yellow"
      />
      <StatCell
        label="Time"
        value={`${timeElapsed}ms`}
        borderColor="border-b-algo-purple"
        textColor="text-algo-purple"
        total={total}
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
