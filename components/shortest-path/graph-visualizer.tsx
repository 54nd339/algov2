"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  type NodeProps,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type {
  GraphNode,
  GraphEdge,
  NodeStatus,
  EdgeStatus,
  GraphSnapshot,
} from "@/lib/types";
import { GRAPH_NODE_SIZE } from "@/config";
import {
  graphFlowProps,
  edgeLabelStyle,
  useGraphFlowSetup,
} from "@/lib/algorithms/shared";
import { NodeHandles } from "@/components/common";

const statusColors: Record<NodeStatus, string> = {
  idle: "var(--muted-foreground)",
  active: "var(--algo-purple)",
  visited: "var(--algo-blue)",
  source: "var(--algo-green)",
  inPath: "var(--algo-yellow)",
};

function GraphNodeComponent({ data }: NodeProps) {
  const d = data as {
    label: string;
    status: NodeStatus;
    distance: number;
    onClick?: () => void;
    hovered?: boolean;
  };
  const color = statusColors[d.status] ?? statusColors.idle;
  const hoverColor = "var(--algo-yellow)";

  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center rounded-full border-2 font-space text-xs"
      style={{
        width: GRAPH_NODE_SIZE,
        height: GRAPH_NODE_SIZE,
        borderColor: d.hovered ? hoverColor : color,
        backgroundColor: `color-mix(in srgb, ${d.hovered ? hoverColor : color} 20%, transparent)`,
        color: d.hovered ? hoverColor : color,
      }}
      onClick={(event) => {
        event.stopPropagation();
        d.onClick?.();
      }}
    >
      <span className="font-bold">{d.label}</span>
      {d.distance !== Infinity && d.distance > 0 && (
        <span className="text-3xs opacity-70">{d.distance}</span>
      )}
      <NodeHandles />
    </div>
  );
}

const nodeTypes = { graphNode: GraphNodeComponent };

const edgeColors: Record<EdgeStatus, string> = {
  idle: "var(--muted-foreground)",
  active: "var(--algo-purple)",
  relaxed: "var(--algo-cyan)",
  inPath: "var(--algo-yellow)",
};

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  snapshot: GraphSnapshot | null;
  sourceNode?: number | null;
  onNodeClick?: (nodeId: number) => void;
}

export function GraphVisualizer(props: GraphVisualizerProps) {
  return (
    <ReactFlowProvider>
      <GraphVisualizerInner {...props} />
    </ReactFlowProvider>
  );
}

function GraphVisualizerInner({
  nodes,
  edges,
  snapshot,
  sourceNode,
  onNodeClick,
}: GraphVisualizerProps) {
  const buildNodes = useCallback(
    () =>
      nodes.map((n) => ({
        id: String(n.id),
        position: { x: n.x, y: n.y },
        type: "graphNode" as const,
        data: {
          label: String(n.id),
          status:
            sourceNode !== null && sourceNode !== undefined && n.id === sourceNode
              ? ("source" as NodeStatus)
              : ("idle" as NodeStatus),
          distance: Infinity,
          onClick: () => onNodeClick?.(n.id),
          hovered: false,
        },
      })),
    [nodes, onNodeClick, sourceNode],
  );

  const {
    flowNodes, flowEdges,
    setFlowNodes, setFlowEdges,
    onNodesChange, onEdgesChange,
    setHover,
  } = useGraphFlowSetup({
    nodes,
    edges,
    idleEdgeColor: edgeColors.idle,
    buildNodesFn: buildNodes,
  });

  useEffect(() => {
    if (!snapshot) return;

    const nodeStatuses = snapshot.nodeStatuses ?? {};
    const edgeStatuses = snapshot.edgeStatuses ?? {};
    const distances = snapshot.distances ?? {};

    setFlowNodes((prev) =>
      prev.map((fn) => {
        const id = Number(fn.id);
        return {
          ...fn,
          data: {
            label: String(id),
            status: nodeStatuses[id] ?? ("idle" as NodeStatus),
            distance: distances[id] ?? Infinity,
            onClick: () => onNodeClick?.(id),
            hovered: fn.data.hovered ?? false,
          },
        };
      }),
    );
    setFlowEdges((prev) =>
      prev.map((fe) => {
        const status = edgeStatuses[fe.id] ?? ("idle" as EdgeStatus);
        return {
          ...fe,
          style: {
            stroke: edgeColors[status],
            strokeWidth: status === "inPath" ? 4 : status === "active" ? 3 : 2,
            opacity: 1,
          },
          labelStyle: edgeLabelStyle(edgeColors[status]),
        };
      }),
    );
  }, [snapshot, onNodeClick, setFlowNodes, setFlowEdges]);

  useEffect(() => {
    if (snapshot) return;
    setFlowNodes((prev) =>
      prev.map((fn) => {
        const id = Number(fn.id);
        return {
          ...fn,
          data: {
            ...fn.data,
            status:
              sourceNode !== null && sourceNode !== undefined && id === sourceNode
                ? ("source" as NodeStatus)
                : ("idle" as NodeStatus),
            distance: Infinity,
            onClick: () => onNodeClick?.(id),
          },
        };
      }),
    );
  }, [snapshot, sourceNode, onNodeClick, setFlowNodes]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={(_e, node) => setHover(Number(node.id), true)}
        onNodeMouseLeave={(_e, node) => setHover(Number(node.id), false)}
        onNodeClick={(_e, node) => onNodeClick?.(Number(node.id))}
        className="!bg-transparent"
        {...graphFlowProps}
      >
        <Background color="var(--algo-grid-line)" gap={40} />
      </ReactFlow>
    </div>
  );
}
