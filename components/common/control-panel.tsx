import { Shuffle } from "lucide-react";
import { ControlPanelShell, GenerateButton, ControlSlider, PlaybackControls } from "@/components/common";

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
  onPlay, onPause, onStep, onReset,
  onSpeedChange, onSizeChange, onGenerate,
  isRunning, isDone, speed, arraySize,
  actionLabel = "Sort",
}: ControlPanelProps) {
  return (
    <ControlPanelShell>
      <GenerateButton onClick={onGenerate} disabled={isRunning} icon={Shuffle} label="Generate" tooltip="Generate new array" />
      <ControlSlider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={60} color="purple" />
      <ControlSlider label="Count" value={arraySize} onChange={onSizeChange} min={5} max={200} color="cyan" disabled={isRunning} />
      <PlaybackControls onPlay={onPlay} onPause={onPause} onStep={onStep} onReset={onReset} isRunning={isRunning} isDone={isDone} playTooltip={actionLabel} />
    </ControlPanelShell>
  );
}
