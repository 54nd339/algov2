"use client";

import { useEffect, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
  getBezierPath,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NodeHandles, EmptyVisualizerState } from "@/components/common";
import { graphFlowProps } from "@/lib/algorithms/shared";
import { buildPerceptronGraph } from "@/lib/algorithms/ai";
import { PERCEPTRON_NODE_SIZE } from "@/config/constants";
import type { PerceptronSnapshot } from "@/lib/types";

/* ── Typed data for custom nodes/edges ─────────────────────────────── */

interface NeuronNodeData extends Record<string, unknown> {
  value: number;
  isInput: boolean;
  label: string;
  bias?: number;
}

interface WeightEdgeData extends Record<string, unknown> {
  weight: number;
}

type NeuronNode = Node<NeuronNodeData, "neuronNode">;
type WeightEdge = Edge<WeightEdgeData, "weightEdge">;

/* ── Custom Node ────────────────────────────────────────────────────── */

function NeuronNodeComponent({ data }: NodeProps<NeuronNode>) {
  const { value = 0, isInput, label } = data;

  const intensity = Math.min(Math.abs(value), 1);
  const bg = isInput
    ? "bg-algo-cyan/20"
    : intensity > 0.5
      ? "bg-algo-green/40"
      : "bg-algo-green/15";

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 border-algo-green/60 ${bg}`}
      style={{ width: PERCEPTRON_NODE_SIZE, height: PERCEPTRON_NODE_SIZE }}
    >
      <NodeHandles />
      <span className="font-space text-3xs font-bold text-foreground">
        {isInput ? label : value.toFixed(2)}
      </span>
    </div>
  );
}

/* ── Custom Edge ────────────────────────────────────────────────────── */

function WeightEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<WeightEdge>) {
  const weight = data?.weight ?? 0;
  const absWeight = Math.min(Math.abs(weight), 3);
  const strokeWidth = 1 + absWeight;
  const color = weight >= 0 ? "var(--algo-cyan)" : "var(--algo-red)";

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.6}
      />
      <foreignObject
        x={labelX - 16}
        y={labelY - 8}
        width={32}
        height={16}
        className="pointer-events-none"
      >
        <div className="flex items-center justify-center font-space text-3xs text-muted-foreground">
          {weight.toFixed(1)}
        </div>
      </foreignObject>
    </>
  );
}

/* ── Node & Edge type maps ──────────────────────────────────────────── */

const nodeTypes = { neuronNode: NeuronNodeComponent };
const edgeTypes = { weightEdge: WeightEdgeComponent };

/* ── Inner visualizer (must be inside ReactFlowProvider) ────────────── */

interface InnerProps {
  snapshot: PerceptronSnapshot | null;
}

function PerceptronFlowInner({ snapshot }: InnerProps) {
  const { fitView } = useReactFlow();
  const prevTopology = useRef("");

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<NeuronNode>([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState<WeightEdge>([]);

  useEffect(() => {
    if (!snapshot) return;
    const inputSize = snapshot.currentInput.length || 2;
    const { nodes, edges } = buildPerceptronGraph(snapshot.network, inputSize);
    setFlowNodes(nodes as NeuronNode[]);
    setFlowEdges(edges as WeightEdge[]);

    const topology = snapshot.network.map((l) => l.neurons.length).join("-");
    if (topology !== prevTopology.current) {
      prevTopology.current = topology;
      const prefersReduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      setTimeout(() => fitView({ duration: prefersReduced ? 0 : 200 }), 50);
    }
  }, [snapshot, setFlowNodes, setFlowEdges, fitView]);

  if (!snapshot) {
    return <EmptyVisualizerState message="Generate a network to begin" />;
  }

  return (
    <ReactFlow<NeuronNode, WeightEdge>
      nodes={flowNodes}
      edges={flowEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      {...graphFlowProps}
    />
  );
}

/* ── Public component ───────────────────────────────────────────────── */

interface PerceptronVisualizerProps {
  snapshot: PerceptronSnapshot | null;
}

export function PerceptronVisualizer({ snapshot }: PerceptronVisualizerProps) {
  return (
    <ReactFlowProvider>
      <PerceptronFlowInner snapshot={snapshot} />
    </ReactFlowProvider>
  );
}
