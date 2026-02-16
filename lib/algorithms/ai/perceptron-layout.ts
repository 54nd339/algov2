import type { Node, Edge } from "@xyflow/react";
import type { PerceptronLayer } from "@/lib/types";
import {
  PERCEPTRON_NODE_SIZE,
  PERCEPTRON_LAYER_GAP,
  PERCEPTRON_NEURON_GAP,
} from "@/config/constants";

/** Convert a PerceptronLayer[] network into ReactFlow Node[] and Edge[]. */
export function buildPerceptronGraph(
  network: PerceptronLayer[],
  inputSize: number,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const half = PERCEPTRON_NODE_SIZE / 2;

  /* ── Input layer (virtual — not in the network array) ─────────── */
  for (let n = 0; n < inputSize; n++) {
    const yOffset = (n - (inputSize - 1) / 2) * PERCEPTRON_NEURON_GAP;
    nodes.push({
      id: `input-${n}`,
      type: "neuronNode",
      position: { x: 0, y: yOffset - half },
      data: { label: `I${n}`, value: 0, isInput: true },
    });
  }

  /* ── Hidden + output layers ───────────────────────────────────── */
  for (let l = 0; l < network.length; l++) {
    const layer = network[l];
    const x = (l + 1) * PERCEPTRON_LAYER_GAP;
    const neuronCount = layer.neurons.length;

    for (let n = 0; n < neuronCount; n++) {
      const yOffset = (n - (neuronCount - 1) / 2) * PERCEPTRON_NEURON_GAP;
      const neuron = layer.neurons[n];

      nodes.push({
        id: neuron.id,
        type: "neuronNode",
        position: { x, y: yOffset - half },
        data: {
          label: neuron.id,
          value: neuron.value,
          isInput: false,
          bias: layer.biases[n],
        },
      });

      /* Edges from previous layer */
      const prevIds =
        l === 0
          ? Array.from({ length: inputSize }, (_, i) => `input-${i}`)
          : network[l - 1].neurons.map((prev) => prev.id);

      for (let p = 0; p < prevIds.length; p++) {
        const weight = layer.weights[n][p];
        edges.push({
          id: `${prevIds[p]}->${neuron.id}`,
          source: prevIds[p],
          target: neuron.id,
          sourceHandle: "right",
          targetHandle: "left",
          type: "weightEdge",
          data: { weight },
        });
      }
    }
  }

  return { nodes, edges };
}
