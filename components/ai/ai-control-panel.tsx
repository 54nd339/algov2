import { Shuffle } from "lucide-react";
import { ControlPanelShell, GenerateButton, ControlSlider, PlaybackControls } from "@/components/common";

interface AIControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onPointCountChange: (count: number) => void;
  onGenerate: () => void;
  onKChange?: (k: number) => void;
  isRunning: boolean;
  isDone: boolean;
  speed: number;
  pointCount: number;
  k?: number;
  showK?: boolean;
}

export function AIControlPanel({
  onPlay, onPause, onStep, onReset,
  onSpeedChange, onPointCountChange, onGenerate, onKChange,
  isRunning, isDone, speed, pointCount, k, showK,
}: AIControlPanelProps) {
  return (
    <ControlPanelShell>
      <GenerateButton onClick={onGenerate} disabled={isRunning} icon={Shuffle} label="Generate" tooltip="Generate new data" />
      <ControlSlider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={30} color="purple" />
      <ControlSlider label="Points" value={pointCount} onChange={onPointCountChange} min={10} max={100} step={5} color="cyan" disabled={isRunning} />
      {showK && onKChange && k !== undefined && (
        <ControlSlider label="K" value={k} onChange={onKChange} min={2} max={10} color="yellow" disabled={isRunning} />
      )}
      <PlaybackControls onPlay={onPlay} onPause={onPause} onStep={onStep} onReset={onReset} isRunning={isRunning} isDone={isDone} />
    </ControlPanelShell>
  );
}
