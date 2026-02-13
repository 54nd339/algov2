import type { MinimaxNode, GamesSnapshot, MinimaxStats } from "@/lib/types/games";

/* ── Minimax with Alpha-Beta Pruning ──────────────────────────── */

export function* minimax(depth: number, options?: { initialBoard?: unknown; startRow?: number; startCol?: number; branching?: number }): Generator<GamesSnapshot> {
  const startTime = performance.now();
  let nodesEvaluated = 0;
  let nodesPruned = 0;
  const branching = options?.branching ?? 3;

  // Generate a game tree
  const nodes: MinimaxNode[] = [];
  generateTree(nodes, "root", depth, true, branching);

  // Assign random values to leaf nodes
  for (const node of nodes) {
    if (node.children.length === 0) {
      node.value = Math.floor(Math.random() * 20) - 10;
    }
  }

  const snap = (bestValue: number | null): GamesSnapshot => {
    const stats: MinimaxStats = {
      nodesEvaluated,
      nodesPruned,
      treeDepth: depth,
      timeElapsed: Math.round(performance.now() - startTime),
    };
    return {
      type: "minimax",
      data: {
        nodes: nodes.map((n) => ({ ...n, children: [...n.children] })),
        bestValue,
        stats,
      },
    };
  };

  yield snap(null);

  function* alphaBeta(
    nodeId: string,
    alpha: number,
    beta: number,
  ): Generator<GamesSnapshot, number> {
    const node = nodes.find((n) => n.id === nodeId)!;
    node.status = "active";
    node.alpha = alpha;
    node.beta = beta;
    yield snap(null);

    // Leaf node
    if (node.children.length === 0) {
      nodesEvaluated++;
      node.status = "evaluated";
      yield snap(null);
      return node.value!;
    }

    if (node.isMax) {
      let maxEval = -Infinity;
      for (const childId of node.children) {
        const val: number = yield* alphaBeta(childId, alpha, beta);
        maxEval = Math.max(maxEval, val);
        alpha = Math.max(alpha, val);
        node.alpha = alpha;

        if (beta <= alpha) {
          // Prune remaining children
          const idx = node.children.indexOf(childId);
          for (let i = idx + 1; i < node.children.length; i++) {
            pruneSubtree(nodes, node.children[i]);
            nodesPruned++;
          }
          yield snap(null);
          break;
        }
      }
      node.value = maxEval;
      nodesEvaluated++;
      node.status = "evaluated";
      yield snap(null);
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const childId of node.children) {
        const val: number = yield* alphaBeta(childId, alpha, beta);
        minEval = Math.min(minEval, val);
        beta = Math.min(beta, val);
        node.beta = beta;

        if (beta <= alpha) {
          const idx = node.children.indexOf(childId);
          for (let i = idx + 1; i < node.children.length; i++) {
            pruneSubtree(nodes, node.children[i]);
            nodesPruned++;
          }
          yield snap(null);
          break;
        }
      }
      node.value = minEval;
      nodesEvaluated++;
      node.status = "evaluated";
      yield snap(null);
      return minEval;
    }
  }

  const bestValue: number = yield* alphaBeta("root", -Infinity, Infinity);

  // Mark the selected path
  markSelectedPath(nodes, "root");
  yield snap(bestValue);
}

function generateTree(
  nodes: MinimaxNode[],
  id: string,
  depth: number,
  isMax: boolean,
  branching: number,
) {
  const children: string[] = [];
  if (depth > 0) {
    for (let i = 0; i < branching; i++) {
      const childId = `${id}-${i}`;
      children.push(childId);
      generateTree(nodes, childId, depth - 1, !isMax, branching);
    }
  }
  nodes.push({
    id,
    value: null,
    isMax,
    children,
    status: "idle",
  });
}

function pruneSubtree(nodes: MinimaxNode[], nodeId: string) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return;
  node.status = "pruned";
  for (const childId of node.children) {
    pruneSubtree(nodes, childId);
  }
}

function markSelectedPath(nodes: MinimaxNode[], nodeId: string) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return;
  node.status = "selected";
  if (node.children.length === 0) return;

  // Find child whose value matches this node's value
  for (const childId of node.children) {
    const child = nodes.find((n) => n.id === childId);
    if (child && child.value === node.value && child.status !== "pruned") {
      markSelectedPath(nodes, childId);
      break;
    }
  }
}
