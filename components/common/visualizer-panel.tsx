import { cn } from "@/lib/utils";
import { TopBar } from "./top-bar";

interface VisualizerPanelProps {
  children: React.ReactNode;
  className?: string;
  showGrid?: boolean;
  showEdgeIcons?: boolean;
}

function EdgeIcon({ flip }: { flip?: boolean }) {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" className="text-algo-green/50">
      <path d={flip ? "M13 0V11H2" : "M2 0V11H13"} stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function VisualizerPanel({
  children,
  className,
  showGrid = true,
  showEdgeIcons = true,
}: VisualizerPanelProps) {
  return (
    <div>
      <TopBar />
      <div
        className={cn(
          "relative border-x border-b border-border bg-background",
          className,
        )}
        style={{ height: "var(--min-height-panel)" }}
      >
        {showGrid && (
          <div
            className="pointer-events-none absolute inset-0 bg-grid-pattern"
            style={{
              backgroundImage: `linear-gradient(var(--algo-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--algo-grid-line) 1px, transparent 1px)`,
            }}
          />
        )}
        <div className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground/50" />
        <div className="pointer-events-none absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground/50" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground/50" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground/50" />
        <div className="relative z-10 h-full overflow-hidden p-2">
          {children}
        </div>
        {showEdgeIcons && (
          <>
            <div className="absolute bottom-0 left-0 z-20">
              <EdgeIcon />
            </div>
            <div className="absolute -bottom-0 right-0 z-20">
              <EdgeIcon flip />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
