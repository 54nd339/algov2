import type { Algorithm } from "@/config";
import { Badge } from "@/components/ui";

interface ComplexityPanelProps {
  algorithm: Algorithm;
}

export function ComplexityPanel({ algorithm }: ComplexityPanelProps) {
  const timeRows = [
    { label: "Best", value: algorithm.complexity.time.best, color: "text-algo-green" },
    { label: "Average", value: algorithm.complexity.time.average, color: "text-algo-yellow" },
    { label: "Worst", value: algorithm.complexity.time.worst, color: "text-algo-red" },
  ];

  return (
    <div className="space-y-5 font-space uppercase">
      <ComplexitySection title="Time Complexity">
        {timeRows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-label-value items-center border-b border-border px-4 py-3 last:border-b-0"
          >
            <span className="text-xs tracking-wider text-muted-foreground">
              {row.label}
            </span>
            <span className={`text-lg font-bold ${row.color}`}>
              {row.value}
            </span>
          </div>
        ))}
      </ComplexitySection>

      <ComplexitySection title="Space Complexity">
        <div className="grid grid-cols-label-value items-center px-4 py-3">
          <span className="text-xs tracking-wider text-muted-foreground">
            All Cases
          </span>
          <span className="text-lg font-bold text-algo-cyan">
            {algorithm.complexity.space}
          </span>
        </div>
      </ComplexitySection>

      <ComplexitySection title="Properties">
        <div className="flex justify-center gap-3 px-3 py-3 text-xs tracking-wider">
          <Badge
            variant="outline"
            className={
              algorithm.stable
                ? "border-algo-green/30 bg-algo-green/10 text-algo-green"
                : "border-algo-red/30 bg-algo-red/10 text-algo-red"
            }
          >
            {algorithm.stable ? "Stable" : "Unstable"}
          </Badge>
          <Badge
            variant="outline"
            className={
              algorithm.inPlace
                ? "border-algo-cyan/30 bg-algo-cyan/10 text-algo-cyan"
                : "border-algo-yellow/30 bg-algo-yellow/10 text-algo-yellow"
            }
          >
            {algorithm.inPlace ? "In-Place" : "Not In-Place"}
          </Badge>
        </div>
      </ComplexitySection>
    </div>
  );
}

function ComplexitySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-center text-xs font-bold tracking-widest text-algo-cyan">
        {title}
      </h3>
      <div className="border border-border bg-card">
        {children}
      </div>
    </div>
  );
}
