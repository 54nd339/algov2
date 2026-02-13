import { Play, Pause, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSizeChange: (size: number) => void;
  onGenerate: () => void;
  isRunning: boolean;
  isDone: boolean;
  speed: number;
  arraySize: number;
  actionLabel?: string;
}

export function ControlPanel({
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  onSizeChange,
  onGenerate,
  isRunning,
  isDone,
  speed,
  arraySize,
  actionLabel = "Sort",
}: ControlPanelProps) {
  return (
    <div className="flex h-[60px] items-stretch font-space text-xs uppercase tracking-wider text-foreground">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isRunning}
            className="flex flex-1 items-center justify-center gap-2 border-l-[10px] border-l-algo-blue bg-algo-blue/10 px-4 transition-colors hover:bg-algo-blue hover:text-background disabled:opacity-40"
          >
            <Shuffle className="size-4" />
            Generate
          </button>
        </TooltipTrigger>
        <TooltipContent>Generate new array</TooltipContent>
      </Tooltip>

      <div className="flex flex-1 items-center gap-3 border-l-[10px] border-l-algo-purple bg-algo-purple/10 px-4">
        <span>Speed</span>
        <Slider
          value={[speed]}
          onValueChange={([v]) => onSpeedChange(v)}
          min={1}
          max={60}
          step={1}
          className="min-w-12 flex-1 [&_[data-slot=slider-range]]:bg-algo-purple [&_[data-slot=slider-thumb]]:border-algo-purple [&_[data-slot=slider-thumb]]:bg-algo-purple"
        />
        <span className="w-6 text-right">{speed}</span>
      </div>

      <div className="flex flex-1 items-center gap-3 border-l-[10px] border-l-algo-cyan bg-algo-cyan/10 px-4">
        <span>Count</span>
        <Slider
          value={[arraySize]}
          onValueChange={([v]) => onSizeChange(v)}
          min={5}
          max={200}
          step={1}
          className="min-w-12 flex-1 [&_[data-slot=slider-range]]:bg-algo-cyan [&_[data-slot=slider-thumb]]:border-algo-cyan [&_[data-slot=slider-thumb]]:bg-algo-cyan"
          disabled={isRunning}
        />
        <span className="w-6 text-right">{arraySize}</span>
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
            <TooltipContent>{actionLabel}</TooltipContent>
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
