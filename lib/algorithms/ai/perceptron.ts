import type {
  PerceptronLayer,
  PerceptronSnapshot,
  PerceptronStats,
} from "@/lib/types";

/* ── Activation functions ───────────────────────────────────────────── */

type ActivationFn = (x: number) => number;
type ActivationPair = { fn: ActivationFn; dfn: ActivationFn };

const ACTIVATIONS: Record<string, ActivationPair> = {
  relu: {
    fn: (x) => Math.max(0, x),
    dfn: (x) => (x > 0 ? 1 : 0),
  },
  sigmoid: {
    fn: (x) => 1 / (1 + Math.exp(-x)),
    dfn: (x) => {
      const s = 1 / (1 + Math.exp(-x));
      return s * (1 - s);
    },
  },
  tanh: {
    fn: (x) => Math.tanh(x),
    dfn: (x) => 1 - Math.tanh(x) ** 2,
  },
  none: {
    fn: (x) => x,
    dfn: () => 1,
  },
};

/* ── Network initialization ─────────────────────────────────────────── */

export function initializeNetwork(
  inputSize: number,
  hiddenLayers: number,
  neuronsPerLayer: number,
): PerceptronLayer[] {
  const layers: PerceptronLayer[] = [];
  let prevSize = inputSize;

  for (let l = 0; l <= hiddenLayers; l++) {
    const isOutput = l === hiddenLayers;
    const size = isOutput ? 1 : neuronsPerLayer;
    const neurons = Array.from({ length: size }, (_, i) => ({
      id: `L${l}-N${i}`,
      value: 0,
      delta: 0,
    }));
    const weights = Array.from({ length: size }, () =>
      Array.from({ length: prevSize }, () => (Math.random() - 0.5) * 2),
    );
    const biases = Array.from({ length: size }, () => (Math.random() - 0.5) * 2);
    layers.push({ neurons, weights, biases });
    prevSize = size;
  }
  return layers;
}

/* ── Forward pass ───────────────────────────────────────────────────── */

function forward(
  network: PerceptronLayer[],
  input: number[],
  activate: ActivationFn,
): number {
  let values = input;
  for (const layer of network) {
    const next: number[] = [];
    for (let n = 0; n < layer.neurons.length; n++) {
      let sum = layer.biases[n];
      for (let p = 0; p < values.length; p++) {
        sum += values[p] * layer.weights[n][p];
      }
      const activated = activate(sum);
      layer.neurons[n].value = activated;
      next.push(activated);
    }
    values = next;
  }
  return values[0];
}

/* ── Backward pass (backpropagation) ────────────────────────────────── */

function backward(
  network: PerceptronLayer[],
  input: number[],
  target: number,
  learningRate: number,
  derivativeFn: ActivationFn,
): void {
  const outputLayer = network[network.length - 1];
  const outputNeuron = outputLayer.neurons[0];
  const outputError = outputNeuron.value - target;
  outputNeuron.delta = outputError * derivativeFn(outputNeuron.value);

  for (let l = network.length - 2; l >= 0; l--) {
    const layer = network[l];
    const nextLayer = network[l + 1];
    for (let n = 0; n < layer.neurons.length; n++) {
      let error = 0;
      for (let k = 0; k < nextLayer.neurons.length; k++) {
        error += nextLayer.neurons[k].delta * nextLayer.weights[k][n];
      }
      layer.neurons[n].delta = error * derivativeFn(layer.neurons[n].value);
    }
  }

  for (let l = 0; l < network.length; l++) {
    const prevValues = l === 0 ? input : network[l - 1].neurons.map((n) => n.value);
    const layer = network[l];
    for (let n = 0; n < layer.neurons.length; n++) {
      for (let p = 0; p < prevValues.length; p++) {
        layer.weights[n][p] -= learningRate * layer.neurons[n].delta * prevValues[p];
      }
      layer.biases[n] -= learningRate * layer.neurons[n].delta;
    }
  }
}

/* ── Training data (XOR) ────────────────────────────────────────────── */

function generateTrainingData(): { inputs: number[][]; targets: number[] } {
  return {
    inputs: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    targets: [0, 1, 1, 0],
  };
}

/* ── Deep-clone network for immutable snapshots ─────────────────────── */

function cloneNetwork(network: PerceptronLayer[]): PerceptronLayer[] {
  return network.map((layer) => ({
    neurons: layer.neurons.map((n) => ({ ...n })),
    weights: layer.weights.map((row) => [...row]),
    biases: [...layer.biases],
  }));
}

/* ── Generator ──────────────────────────────────────────────────────── */

export function* perceptron(
  network: PerceptronLayer[],
  params: { activationFunction: string; totalEpochs: number },
): Generator<PerceptronSnapshot> {
  const { activationFunction, totalEpochs } = params;
  const { fn: activate, dfn: derivative } = ACTIVATIONS[activationFunction] ?? ACTIVATIONS.relu;
  const { inputs, targets } = generateTrainingData();
  const learningRate = 0.5;
  const startTime = performance.now();

  const makeStats = (epoch: number, loss: number, accuracy: number): PerceptronStats => ({
    epoch,
    totalEpochs,
    loss: Math.round(loss * 10000) / 10000,
    accuracy: Math.round(accuracy * 100) / 100,
    timeElapsed: Math.round(performance.now() - startTime),
  });

  const snap = (
    epoch: number,
    inputVec: number[],
    output: number,
    loss: number,
    accuracy: number,
  ): PerceptronSnapshot => ({
    network: cloneNetwork(network),
    currentInput: inputVec,
    currentOutput: Math.round(output * 1000) / 1000,
    stats: makeStats(epoch, loss, accuracy),
  });

  /* Yield initial state */
  yield snap(0, inputs[0], forward(network, inputs[0], activate), 1, 0);

  for (let epoch = 1; epoch <= totalEpochs; epoch++) {
    let totalLoss = 0;
    let correct = 0;

    for (let s = 0; s < inputs.length; s++) {
      const output = forward(network, inputs[s], activate);
      const error = (targets[s] - output) ** 2;
      totalLoss += error;

      backward(network, inputs[s], targets[s], learningRate, derivative);

      const predicted = output > 0.5 ? 1 : 0;
      if (predicted === targets[s]) correct++;

      const avgLoss = totalLoss / (s + 1);
      const accuracy = (correct / (s + 1)) * 100;
      yield snap(epoch, inputs[s], output, avgLoss, accuracy);
    }
  }
}
