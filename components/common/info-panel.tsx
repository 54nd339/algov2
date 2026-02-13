import { cn } from "@/lib/utils";

interface InfoPanelProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  className?: string;
}

export function InfoPanel({
  leftContent,
  rightContent,
  className,
}: InfoPanelProps) {
  return (
    <div
      className={cn(
        "grid gap-2 md:grid-cols-[2fr_1fr]",
        className,
      )}
    >
      <div className="min-w-0 overflow-hidden border border-border bg-background p-4 md:p-5">
        {leftContent}
      </div>
      <div className="border border-border bg-background p-4 md:p-5">
        {rightContent}
      </div>
    </div>
  );
}
