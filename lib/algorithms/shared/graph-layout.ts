interface Positioned {
  x: number;
  y: number;
}

/**
 * Determines which handle pair (left/right or top/bottom) to use for an edge
 * based on the relative positions of source and target nodes, so edges
 * connect from the closest sides rather than overlapping node centers.
 */
export function getEdgeHandles(source?: Positioned, target?: Positioned) {
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
}
