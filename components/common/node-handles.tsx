"use client";

import { Handle, Position } from "@xyflow/react";

/** Invisible handles reused by every ReactFlow graph node component (4 source + 4 target at cardinal positions). */
const HANDLE_CLS = "!bg-transparent !border-0 !w-0 !h-0";

export function NodeHandles() {
  return (
    <>
      <Handle id="left" type="source" position={Position.Left} className={HANDLE_CLS} />
      <Handle id="right" type="source" position={Position.Right} className={HANDLE_CLS} />
      <Handle id="top" type="source" position={Position.Top} className={HANDLE_CLS} />
      <Handle id="bottom" type="source" position={Position.Bottom} className={HANDLE_CLS} />
      <Handle id="left" type="target" position={Position.Left} className={HANDLE_CLS} />
      <Handle id="right" type="target" position={Position.Right} className={HANDLE_CLS} />
      <Handle id="top" type="target" position={Position.Top} className={HANDLE_CLS} />
      <Handle id="bottom" type="target" position={Position.Bottom} className={HANDLE_CLS} />
    </>
  );
}
