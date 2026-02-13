"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  PanOnScrollMode,
  type NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type {
  GraphNode,
  GraphEdge,
  MSTNodeStatus,
  MSTEdgeStatus,
  MSTSnapshot,
} from "@/lib/types/mst";

/* ── Custom node ────────────────────────────────────────────────── */

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
        width: 44,
        height: 44,
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
      <Handle id="left" type="source" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="top" type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="right" type="target" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="top" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="bottom" type="target" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  );
}

const nodeTypes = { mstNode: MSTNodeComponent };

/* ── Edge status → color ──────────────────────────────────────────── */

const edgeColors: Record<MSTEdgeStatus, string> = {
  idle: "var(--muted-foreground)",
  active: "var(--algo-purple)",
  inMST: "var(--algo-green)",
  considered: "var(--algo-yellow)",
  rejected: "var(--algo-red)",
};

/* ── Main component ────────────────────────────────────────────────── */

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
  const prevNodesId = useRef<string>("");
  const { fitView } = useReactFlow();
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n] as const)), [nodes]);

  const getEdgeHandles = (source?: GraphNode, target?: GraphNode) => {
    if (!source || !target) return {};
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return {
        sourceHandle: dx >= 0 ? "right" : "left",
        targetHandle: dx >= 0 ? "left" : "right",
      };
    }
    return {
      sourceHandle: dy >= 0 ? "bottom" : "top",
      targetHandle: dy >= 0 ? "top" : "bottom",
    };
  };

  const makeFlowNodes = useCallback(
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

  const makeFlowEdges = useCallback(
    () =>
      edges.map((e) => {
        const handles = getEdgeHandles(nodeById.get(e.u), nodeById.get(e.v));
        return {
          id: e.id,
          source: String(e.u),
          target: String(e.v),
          label: String(e.weight),
          style: { stroke: edgeColors.idle, strokeWidth: 2, opacity: 1 },
          labelStyle: {
            fill: edgeColors.idle,
            fontSize: 11,
            fontFamily: "var(--font-space)",
            fontWeight: "500",
          },
          type: "step" as const,
          ...handles,
        };
      }),
    [edges, nodeById],
  );

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(makeFlowNodes());
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(makeFlowEdges());

  const nodesFingerprint = [
    nodes.map((n) => `${n.id}:${n.x}:${n.y}`).join("|"),
    edges.map((e) => `${e.id}:${e.u}:${e.v}:${e.weight}`).join("|"),
  ].join("||");

  // Effect 1: Reset on structure changes
  useEffect(() => {
    if (nodesFingerprint !== prevNodesId.current) {
      prevNodesId.current = nodesFingerprint;
      setFlowNodes(makeFlowNodes());
      setFlowEdges(makeFlowEdges());
      setTimeout(() => fitView({ duration: 200 }), 50);
    }
  }, [nodesFingerprint, makeFlowNodes, makeFlowEdges, setFlowNodes, setFlowEdges, fitView]);

  // Effect 2: Update snapshot data
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
          labelStyle: {
            fill: edgeColors[status],
            fontSize: 11,
            fontFamily: "var(--font-space)",
            fontWeight: "500",
          },
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

  const setHover = (nodeId: number, hovered: boolean) => {
    setFlowNodes((prev) =>
      prev.map((node) =>
        Number(node.id) === nodeId
          ? { ...node, data: { ...node.data, hovered } }
          : node,
      ),
    );
  };

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
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={2}
        panOnDrag
        panOnScroll
        panOnScrollMode={PanOnScrollMode.Free}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeClick={(_e, node) => onNodeClick?.(Number(node.id))}
      >
        <Background gap={20} size={1} className="opacity-20" />
      </ReactFlow>
    </div>
  );
}
