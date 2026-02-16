import { Shuffle } from "lucide-react";
import { ControlPanelShell, GenerateButton, ControlSlider, PlaybackControls } from "@/components/common";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import type { PerceptronContext } from "@/lib/types";

const ACTIVATION_CYCLE: PerceptronContext["activationFunction"][] = ["none", "relu", "sigmoid", "tanh"];

interface PerceptronControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onLayersChange: (layers: number) => void;
  onActivationChange: (fn: PerceptronContext["activationFunction"]) => void;
  onGenerate: () => void;
  isRunning: boolean;
  isDone: boolean;
  speed: number;
  layers: number;
  activationFunction: PerceptronContext["activationFunction"];
}

export function PerceptronControlPanel({
  onPlay, onPause, onStep, onReset,
  onSpeedChange, onLayersChange, onActivationChange, onGenerate,
  isRunning, isDone, speed, layers, activationFunction,
}: PerceptronControlPanelProps) {
  const cycleActivation = () => {
    const idx = ACTIVATION_CYCLE.indexOf(activationFunction);
    const next = ACTIVATION_CYCLE[(idx + 1) % ACTIVATION_CYCLE.length];
    onActivationChange(next);
  };

  return (
    <ControlPanelShell>
      <GenerateButton onClick={onGenerate} disabled={isRunning} icon={Shuffle} label="Generate" tooltip="Generate new network" />
      <ControlSlider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={30} color="purple" />
      <ControlSlider label="Layers" value={layers} onChange={onLayersChange} min={1} max={6} color="cyan" disabled={isRunning} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={null}
            size={null}
            onClick={cycleActivation}
            disabled={isRunning}
            className="flex flex-1 items-center justify-center gap-2 rounded-none border-l-10 border-l-algo-yellow bg-algo-yellow/10 px-4 text-xs uppercase tracking-wider transition-colors hover:bg-algo-yellow hover:text-background disabled:opacity-40"
          >
            {activationFunction}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cycle activation function</TooltipContent>
      </Tooltip>
      <PlaybackControls onPlay={onPlay} onPause={onPause} onStep={onStep} onReset={onReset} isRunning={isRunning} isDone={isDone} />
    </ControlPanelShell>
  );
}
