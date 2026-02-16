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
        "grid gap-2 md:grid-cols-info-split",
        className,
      )}
    >
      <div className="min-w-0 overflow-hidden border-2 border-border bg-card p-5 md:p-6">
        {leftContent}
      </div>
      <div className="border-2 border-border bg-card p-5 md:p-6">
        {rightContent}
      </div>
    </div>
  );
}
