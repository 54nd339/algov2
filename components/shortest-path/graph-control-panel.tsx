import { Shuffle } from "lucide-react";
import { ControlPanelShell, GenerateButton, ControlSlider, PlaybackControls } from "@/components/common";

interface GraphControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onNodeCountChange: (count: number) => void;
  onGenerate: () => void;
  isRunning: boolean;
  isDone: boolean;
  speed: number;
  nodeCount: number;
}

export function GraphControlPanel({
  onPlay, onPause, onStep, onReset,
  onSpeedChange, onNodeCountChange, onGenerate,
  isRunning, isDone, speed, nodeCount,
}: GraphControlPanelProps) {
  return (
    <ControlPanelShell>
      <GenerateButton onClick={onGenerate} disabled={isRunning} icon={Shuffle} label="Generate" tooltip="Generate new graph" />
      <ControlSlider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={30} color="purple" />
      <ControlSlider label="Nodes" value={nodeCount} onChange={onNodeCountChange} min={4} max={20} color="cyan" disabled={isRunning} />
      <PlaybackControls onPlay={onPlay} onPause={onPause} onStep={onStep} onReset={onReset} isRunning={isRunning} isDone={isDone} />
    </ControlPanelShell>
  );
}
