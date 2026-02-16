export interface PerceptronNeuron {
  id: string;
  value: number;
  delta: number;
}

export interface PerceptronLayer {
  neurons: PerceptronNeuron[];
  weights: number[][];
  biases: number[];
}

export interface PerceptronStats {
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  timeElapsed: number;
}

export interface PerceptronSnapshot {
  network: PerceptronLayer[];
  currentInput: number[];
  currentOutput: number;
  stats: PerceptronStats;
}

export interface PerceptronContext {
  speed: number;
  stepIndex: number;
  snapshot: PerceptronSnapshot | null;
  layers: number;
  neuronsPerLayer: number;
  activationFunction: "relu" | "sigmoid" | "tanh" | "none";
  totalEpochs: number;
}

export type PerceptronEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "step" }
  | { type: "reset" }
  | { type: "done" }
  | { type: "generate" }
  | { type: "speedChange"; speed: number }
  | { type: "layersChange"; layers: number }
  | { type: "activationChange"; fn: PerceptronContext["activationFunction"] }
  | { type: "updateSnapshot"; snapshot: PerceptronSnapshot };

export type PerceptronAlgorithmFn = (
  network: PerceptronLayer[],
  params: { activationFunction: string; totalEpochs: number },
) => Generator<PerceptronSnapshot>;
