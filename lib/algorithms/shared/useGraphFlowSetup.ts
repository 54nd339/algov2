"use client";

import { useCallback, useMemo } from "react";
import { useNodesState, useEdgesState, type Node } from "@xyflow/react";
import type { GraphNode, GraphEdge } from "@/lib/types";
import { getEdgeHandles } from "./graph-layout";
import { edgeLabelStyle, useGraphSync } from "./graph-flow";

interface GraphFlowSetupOptions {
  nodes: GraphNode[];
  edges: GraphEdge[];
  idleEdgeColor: string;
  buildNodesFn: () => Node[];
}

/**
 * Encapsulates the ReactFlow state management shared by
 * GraphVisualizer and MSTVisualizer: node index, edge builder,
 * topology fingerprint, flow state, and sync/hover.
 */
export function useGraphFlowSetup({
  nodes,
  edges,
  idleEdgeColor,
  buildNodesFn,
}: GraphFlowSetupOptions) {
  const nodeById = useMemo(
    () => new Map(nodes.map((n) => [n.id, n] as const)),
    [nodes],
  );

  const buildEdges = useCallback(
    () =>
      edges.map((e) => {
        const handles = getEdgeHandles(nodeById.get(e.u), nodeById.get(e.v));
        return {
          id: e.id,
          source: String(e.u),
          target: String(e.v),
          label: String(e.weight),
          style: { stroke: idleEdgeColor, strokeWidth: 2, opacity: 1 },
          labelStyle: edgeLabelStyle(idleEdgeColor),
          type: "step" as const,
          ...handles,
        };
      }),
    [edges, nodeById, idleEdgeColor],
  );

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(buildNodesFn());
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(buildEdges());

  const fingerprint = [
    nodes.map((n) => `${n.id}:${n.x}:${n.y}`).join("|"),
    edges.map((e) => `${e.id}:${e.u}:${e.v}:${e.weight}`).join("|"),
  ].join("||");

  const { setHover } = useGraphSync({
    fingerprint,
    rebuildNodes: buildNodesFn,
    rebuildEdges: buildEdges,
    setFlowNodes,
    setFlowEdges,
  });

  return {
    nodeById,
    flowNodes,
    flowEdges,
    setFlowNodes,
    setFlowEdges,
    onNodesChange,
    onEdgesChange,
    setHover,
  };
}
