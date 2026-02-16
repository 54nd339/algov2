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
  MSTNodeStatus,
  MSTEdgeStatus,
  MSTSnapshot,
} from "@/lib/types";
import { GRAPH_NODE_SIZE } from "@/config";
import {
  graphFlowProps,
  edgeLabelStyle,
  useGraphFlowSetup,
} from "@/lib/algorithms/shared";
import { NodeHandles } from "@/components/common";

const statusColors: Record<MSTNodeStatus, string> = {
  idle: "var(--muted-foreground)",
  active: "var(--algo-purple)",
  inMST: "var(--algo-green)",
  source: "var(--algo-cyan)",
};

function MSTNodeComponent({ data }: NodeProps) {
  const d = data as {
    label: string;
    status: MSTNodeStatus;
    onClick?: () => void;
    hovered?: boolean;
  };
  const color = statusColors[d.status] ?? statusColors.idle;
  const hoverColor = "var(--algo-yellow)";

  return (
    <div
      className="flex cursor-pointer items-center justify-center rounded-full border-2 font-space text-xs font-bold"
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
      {d.label}
      <NodeHandles />
    </div>
  );
}

const nodeTypes = { mstNode: MSTNodeComponent };

const edgeColors: Record<MSTEdgeStatus, string> = {
  idle: "var(--muted-foreground)",
  active: "var(--algo-purple)",
  inMST: "var(--algo-green)",
  considered: "var(--algo-yellow)",
  rejected: "var(--algo-red)",
};

interface MSTVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  snapshot: MSTSnapshot | null;
  sourceNode?: number | null;
  onNodeClick?: (nodeId: number) => void;
}

export function MSTVisualizer(props: MSTVisualizerProps) {
  return (
    <ReactFlowProvider>
      <MSTVisualizerInner {...props} />
    </ReactFlowProvider>
  );
}

function MSTVisualizerInner({ nodes, edges, snapshot, sourceNode, onNodeClick }: MSTVisualizerProps) {
  const buildNodes = useCallback(
    () =>
      nodes.map((n) => ({
        id: String(n.id),
        position: { x: n.x, y: n.y },
        type: "mstNode" as const,
        data: {
          label: String(n.id),
          status:
            sourceNode !== null && sourceNode !== undefined && n.id === sourceNode
              ? ("source" as MSTNodeStatus)
              : ("idle" as MSTNodeStatus),
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

    setFlowNodes((prev) =>
      prev.map((fn) => {
        const id = Number(fn.id);
        return {
          ...fn,
          data: {
            label: String(id),
            status: nodeStatuses[id] ?? ("idle" as MSTNodeStatus),
            onClick: () => onNodeClick?.(id),
            hovered: fn.data.hovered ?? false,
          },
        };
      }),
    );

    setFlowEdges((prev) =>
      prev.map((fe) => {
        const status = edgeStatuses[fe.id] ?? ("idle" as MSTEdgeStatus);
        return {
          ...fe,
          style: {
            stroke: edgeColors[status],
            strokeWidth: status === "inMST" ? 4 : status === "active" ? 3 : 2,
            opacity: status === "rejected" ? 0.4 : 1,
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
                ? ("source" as MSTNodeStatus)
                : ("idle" as MSTNodeStatus),
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
        {...graphFlowProps}
      >
        <Background gap={20} size={1} className="opacity-20" />
      </ReactFlow>
    </div>
  );
}
