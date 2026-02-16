import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Slider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */

export function ControlPanelShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-panel-control items-stretch font-space text-xs uppercase tracking-wider text-foreground">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generate / action button (left-most slot)                          */
/* ------------------------------------------------------------------ */

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  tooltip: string;
}

export function GenerateButton({ onClick, disabled, icon: Icon, label, tooltip }: GenerateButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={null}
          size={null}
          onClick={onClick}
          disabled={disabled}
          className="flex flex-1 items-center justify-center gap-2 rounded-none border-l-10 border-l-algo-blue bg-algo-blue/10 px-4 transition-colors hover:bg-algo-blue hover:text-background disabled:opacity-40"
        >
          <Icon className="size-4" />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  Colored slider section                                             */
/* ------------------------------------------------------------------ */

type AlgoColor = "purple" | "cyan" | "yellow";

/** Container classes: border color + background tint for the slider section. */
const containerColorMap: Record<AlgoColor, string> = {
  purple: "border-l-algo-purple bg-algo-purple/10",
  cyan: "border-l-algo-cyan bg-algo-cyan/10",
  yellow: "border-l-algo-yellow bg-algo-yellow/10",
};

/** Slider track + thumb theming classes. */
const sliderColorMap: Record<AlgoColor, string> = {
  purple: "[&_[data-slot=slider-range]]:bg-algo-purple [&_[data-slot=slider-thumb]]:border-algo-purple [&_[data-slot=slider-thumb]]:bg-algo-purple",
  cyan: "[&_[data-slot=slider-range]]:bg-algo-cyan [&_[data-slot=slider-thumb]]:border-algo-cyan [&_[data-slot=slider-thumb]]:bg-algo-cyan",
  yellow: "[&_[data-slot=slider-range]]:bg-algo-yellow [&_[data-slot=slider-thumb]]:border-algo-yellow [&_[data-slot=slider-thumb]]:bg-algo-yellow",
};

interface ControlSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  color: AlgoColor;
  disabled?: boolean;
}

export function ControlSlider({ label, value, onChange, min, max, step = 1, color, disabled }: ControlSliderProps) {
  return (
    <div className={cn("flex flex-1 items-center gap-3 border-l-10 px-4", containerColorMap[color])}>
      <span>{label}</span>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className={cn("min-w-12 flex-1", sliderColorMap[color])}
        disabled={disabled}
      />
      <span className="w-6 text-right">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Playback controls (rightmost slot)                                 */
/* ------------------------------------------------------------------ */

interface PlaybackControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  isRunning: boolean;
  isDone: boolean;
  playTooltip?: string;
}

export function PlaybackControls({
  onPlay,
  onPause,
  onStep,
  onReset,
  isRunning,
  isDone,
  playTooltip = "Run Algorithm",
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-1 items-stretch border-l-10 border-l-algo-green bg-algo-green/10">
      {!isRunning ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={null}
              size={null}
              onClick={onPlay}
              disabled={isDone}
              className="flex flex-1 items-center justify-center rounded-none transition-colors hover:bg-algo-green hover:text-background disabled:opacity-40"
            >
              <Play className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{playTooltip}</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={null}
              size={null}
              onClick={onPause}
              className="flex flex-1 items-center justify-center rounded-none transition-colors hover:bg-algo-green hover:text-background"
            >
              <Pause className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Pause</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={null}
            size={null}
            onClick={onStep}
            disabled={isRunning || isDone}
            className="flex flex-1 items-center justify-center rounded-none border-l border-l-border transition-colors hover:bg-algo-green hover:text-background disabled:opacity-40"
          >
            <SkipForward className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Step</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={null}
            size={null}
            onClick={onReset}
            className="flex flex-1 items-center justify-center rounded-none border-l border-l-border transition-colors hover:bg-algo-green hover:text-background"
          >
            <RotateCcw className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset</TooltipContent>
      </Tooltip>
    </div>
  );
}
