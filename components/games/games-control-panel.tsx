import { Shuffle } from "lucide-react";
import { ControlPanelShell, GenerateButton, ControlSlider, PlaybackControls } from "@/components/common";

interface GamesControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onBoardSizeChange: (size: number) => void;
  onGenerate: () => void;
  isRunning: boolean;
  isDone: boolean;
  speed: number;
  boardSize: number;
  sizeLabel: string;
  sizeMin: number;
  sizeMax: number;
  sizeStep?: number;
  branchingFactor?: number;
  onBranchingChange?: (b: number) => void;
  showBranching?: boolean;
  showGenerate?: boolean;
}

export function GamesControlPanel({
  onPlay, onPause, onStep, onReset,
  onSpeedChange, onBoardSizeChange, onGenerate,
  isRunning, isDone, speed, boardSize,
  sizeLabel, sizeMin, sizeMax, sizeStep = 1,
  branchingFactor, onBranchingChange, showBranching,
  showGenerate = true,
}: GamesControlPanelProps) {
  return (
    <ControlPanelShell>
      {showGenerate && (
        <GenerateButton onClick={onGenerate} disabled={isRunning} icon={Shuffle} label="Generate" tooltip="Generate new puzzle" />
      )}
      <ControlSlider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={30} color="purple" />
      <ControlSlider label={sizeLabel} value={boardSize} onChange={onBoardSizeChange} min={sizeMin} max={sizeMax} step={sizeStep} color="cyan" disabled={isRunning} />
      {showBranching && onBranchingChange && branchingFactor !== undefined && (
        <ControlSlider label="Branch" value={branchingFactor} onChange={onBranchingChange} min={2} max={5} color="yellow" disabled={isRunning} />
      )}
      <PlaybackControls onPlay={onPlay} onPause={onPause} onStep={onStep} onReset={onReset} isRunning={isRunning} isDone={isDone} />
    </ControlPanelShell>
  );
}
