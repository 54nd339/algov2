import { cn } from "@/lib/utils";

interface StatCellProps {
  label: string;
  value: number | string;
  borderColor?: string;
  textColor?: string;
  total?: number;
  variant?: "default" | "compact";
}

export function StatCell({
  label,
  value,
  borderColor = "border-b-algo-green",
  textColor = "text-algo-green",
  total,
  variant = "default",
}: StatCellProps) {
  const formatted = typeof value === "number" ? value.toLocaleString() : value;

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center justify-center gap-1 border border-border/30 bg-card/50 px-3 py-2">
        <span className="font-space text-2xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className={cn("font-space text-lg font-bold", textColor)}>
          {formatted}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-b-10 border-r border-r-border bg-card px-4 py-3 last:border-r-0",
        borderColor,
      )}
    >
      <p className="text-2xs tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("text-3xl font-bold", textColor)}>
        {formatted}
      </p>
      {total !== undefined && typeof value === "number" && (
        <p className="mt-0.5 text-2xs text-muted-foreground">
          {Math.round((value / total) * 100)}%
          <span className="text-muted-foreground/60"> / {total}</span>
        </p>
      )}
    </div>
  );
}
