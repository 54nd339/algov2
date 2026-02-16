interface EmptyVisualizerStateProps {
  message?: string;
}

/** Placeholder shown inside a visualizer panel before the algorithm runs. */
export function EmptyVisualizerState({ message = "Press Play to start" }: EmptyVisualizerStateProps) {
  return (
    <div className="flex h-full w-full items-center justify-center font-space text-muted-foreground">
      {message}
    </div>
  );
}
