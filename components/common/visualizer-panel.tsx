import { cn } from "@/lib/utils";

interface VisualizerPanelProps {
  children: React.ReactNode;
  className?: string;
  showGrid?: boolean;
}

export function VisualizerPanel({
  children,
  className,
  showGrid = true,
}: VisualizerPanelProps) {
  return (
    <div
      className={cn(
        "relative h-[55vh] min-h-[65vh] border border-border bg-background",
        className,
      )}
    >
      {showGrid && (
        <div className="pointer-events-none absolute inset-0 bg-[image:linear-gradient(rgba(30,254,91,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,254,91,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      )}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-foreground/30" />
      <div className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground/50" />
      <div className="pointer-events-none absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground/50" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground/50" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground/50" />
      <div className="relative z-10 h-full p-1">
        {children}
      </div>
    </div>
  );
}
