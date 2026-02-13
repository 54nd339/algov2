import { Play, Pause, SkipForward, RotateCcw, Shuffle, Grid3X3 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PathfindingControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onGenerateMaze: () => void;
  onSizeChange: (rows: number, cols: number) => void;
  isRunning: boolean;
  isDone: boolean;
  speed: number;
  gridRows: number;
}

export function PathfindingControlPanel({
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  onGenerateMaze,
  onSizeChange,
  isRunning,
  isDone,
  speed,
  gridRows,
}: PathfindingControlPanelProps) {
  const handleSizeChange = (rows: number) => {
    // Maintain aspect ratio: default is 21x41, ratio ≈ 1.95
    const cols = Math.round(rows * 1.95);
    onSizeChange(rows, cols);
  };
  return (
    <div className="flex h-[60px] items-stretch font-space text-xs uppercase tracking-wider text-foreground">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onGenerateMaze}
            disabled={isRunning}
            className="flex flex-1 items-center justify-center gap-2 border-l-[10px] border-l-algo-blue bg-algo-blue/10 px-4 transition-colors hover:bg-algo-blue hover:text-background disabled:opacity-40"
          >
            <Grid3X3 className="size-4" />
            Maze
          </button>
        </TooltipTrigger>
        <TooltipContent>Generate random maze</TooltipContent>
      </Tooltip>

      <div className="flex flex-1 items-center gap-3 border-l-[10px] border-l-algo-cyan bg-algo-cyan/10 px-4">
        <span>Size</span>
        <Slider
          value={[gridRows]}
          onValueChange={([v]) => handleSizeChange(v)}
          min={11}
          max={31}
          step={2}
          className="min-w-12 flex-1 [&_[data-slot=slider-range]]:bg-algo-cyan [&_[data-slot=slider-thumb]]:border-algo-cyan [&_[data-slot=slider-thumb]]:bg-algo-cyan"
          disabled={isRunning}
        />
        <span className="w-6 text-right">{gridRows}</span>
      </div>

      <div className="flex flex-1 items-center gap-3 border-l-[10px] border-l-algo-purple bg-algo-purple/10 px-4">
        <span>Speed</span>
        <Slider
          value={[speed]}
          onValueChange={([v]) => onSpeedChange(v)}
          min={1}
          max={120}
          step={1}
          className="min-w-12 flex-1 [&_[data-slot=slider-range]]:bg-algo-purple [&_[data-slot=slider-thumb]]:border-algo-purple [&_[data-slot=slider-thumb]]:bg-algo-purple"
        />
        <span className="w-6 text-right">{speed}</span>
      </div>

      <div className="flex flex-1 items-stretch border-l-[10px] border-l-algo-green bg-algo-green/10">
        {!isRunning ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onPlay}
                disabled={isDone}
                className="flex flex-1 items-center justify-center transition-colors hover:bg-algo-green hover:text-background disabled:opacity-40"
              >
                <Play className="size-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Find Path</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onPause}
                className="flex flex-1 items-center justify-center transition-colors hover:bg-algo-green hover:text-background"
              >
                <Pause className="size-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Pause</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onStep}
              disabled={isRunning || isDone}
              className="flex flex-1 items-center justify-center border-l border-l-border transition-colors hover:bg-algo-green hover:text-background disabled:opacity-40"
            >
              <SkipForward className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Step</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReset}
              className="flex flex-1 items-center justify-center border-l border-l-border transition-colors hover:bg-algo-green hover:text-background"
            >
              <RotateCcw className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Reset</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
