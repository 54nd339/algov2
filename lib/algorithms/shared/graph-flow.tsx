"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  PanOnScrollMode,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { EDGE_LABEL_FONT_SIZE } from "@/config";

/* ------------------------------------------------------------------ */
/*  Both graph & MST visualizers render with identical ReactFlow      */
/*  behaviour — centralised here to avoid divergence.                 */
/* ------------------------------------------------------------------ */

export const graphFlowProps = {
  fitView: true,
  proOptions: { hideAttribution: true },
  minZoom: 0.3,
  maxZoom: 2,
  panOnDrag: [1, 2] as number[],
  panOnScroll: true,
  panOnScrollMode: PanOnScrollMode.Free,
  zoomOnScroll: false,
  zoomOnPinch: false,
  zoomOnDoubleClick: false,
  nodesDraggable: true,
  nodesConnectable: false,
  elementsSelectable: false,
} as const;

/* ------------------------------------------------------------------ */
/*  Edge labels must use the Space Grotesk font at a fixed size to    */
/*  stay readable at any zoom level — extracted to stay consistent.   */
/* ------------------------------------------------------------------ */

export function edgeLabelStyle(color: string) {
  return {
    fill: color,
    fontSize: EDGE_LABEL_FONT_SIZE,
    fontFamily: "var(--font-space)",
    fontWeight: "500",
  } as const;
}

/* ------------------------------------------------------------------ */
/*  useGraphSync – fingerprint-based topology re-sync + hover         */
/* ------------------------------------------------------------------ */

interface GraphSyncOptions {
  fingerprint: string;
  /** Produces the initial/reset node array for ReactFlow. */
  rebuildNodes: () => Node[];
  /** Produces the initial/reset edge array for ReactFlow. */
  rebuildEdges: () => Edge[];
  /* eslint-disable @typescript-eslint/no-explicit-any -- ReactFlow state setters have narrow generics per-visualizer */
  setFlowNodes: (updater: any) => void;
  setFlowEdges: (updater: any) => void;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Re-syncs ReactFlow internal state whenever the graph fingerprint changes
 * (e.g. after generate/reset), then triggers a fitView.
 * Also provides a stable setHover callback.
 */
export function useGraphSync({
  fingerprint,
  rebuildNodes,
  rebuildEdges,
  setFlowNodes,
  setFlowEdges,
}: GraphSyncOptions) {
  const prevId = useRef("");
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (fingerprint !== prevId.current) {
      prevId.current = fingerprint;
      setFlowNodes(rebuildNodes());
      setFlowEdges(rebuildEdges());
      // Respect reduced-motion preference for the pan animation
      const prefersReduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      setTimeout(() => fitView({ duration: prefersReduced ? 0 : 200 }), 50);
    }
  }, [fingerprint, rebuildNodes, rebuildEdges, setFlowNodes, setFlowEdges, fitView]);

  const setHover = useCallback(
    (nodeId: number, hovered: boolean) => {
      setFlowNodes((prev: readonly Node[]) =>
        prev.map((node: Node) =>
          Number(node.id) === nodeId
            ? { ...node, data: { ...node.data, hovered } }
            : node,
        ),
      );
    },
    [setFlowNodes],
  );

  return { setHover };
}
