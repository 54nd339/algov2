import { Grid3X3 } from "lucide-react";
import { ControlPanelShell, GenerateButton, ControlSlider, PlaybackControls } from "@/components/common";
import { colsForRows } from "@/lib/algorithms/pathfinding";

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
  onPlay, onPause, onStep, onReset,
  onSpeedChange, onGenerateMaze, onSizeChange,
  isRunning, isDone, speed, gridRows,
}: PathfindingControlPanelProps) {
  return (
    <ControlPanelShell>
      <GenerateButton onClick={onGenerateMaze} disabled={isRunning} icon={Grid3X3} label="Maze" tooltip="Generate random maze" />
      <ControlSlider label="Size" value={gridRows} onChange={(v) => onSizeChange(v, colsForRows(v))} min={11} max={31} step={2} color="cyan" disabled={isRunning} />
      <ControlSlider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={120} color="purple" />
      <PlaybackControls onPlay={onPlay} onPause={onPause} onStep={onStep} onReset={onReset} isRunning={isRunning} isDone={isDone} playTooltip="Find Path" />
    </ControlPanelShell>
  );
}
