import { Shuffle } from "lucide-react";
import { ControlPanelShell, GenerateButton, ControlSlider, PlaybackControls } from "@/components/common";

interface ClassicControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onDiscCountChange: (count: number) => void;
  onGenerate: () => void;
  isRunning: boolean;
  isDone: boolean;
  speed: number;
  discCount: number;
  showGenerate?: boolean;
}

export function ClassicControlPanel({
  onPlay, onPause, onStep, onReset,
  onSpeedChange, onDiscCountChange, onGenerate,
  isRunning, isDone, speed, discCount,
  showGenerate = true,
}: ClassicControlPanelProps) {
  return (
    <ControlPanelShell>
      {showGenerate && (
        <GenerateButton onClick={onGenerate} disabled={isRunning} icon={Shuffle} label="Generate" tooltip="Generate new puzzle" />
      )}
      <ControlSlider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={30} color="purple" />
      <ControlSlider label="Discs" value={discCount} onChange={onDiscCountChange} min={1} max={8} color="cyan" disabled={isRunning} />
      <PlaybackControls onPlay={onPlay} onPause={onPause} onStep={onStep} onReset={onReset} isRunning={isRunning} isDone={isDone} />
    </ControlPanelShell>
  );
}
