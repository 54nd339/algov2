"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { findAlgorithm, findCategory, type Algorithm } from "@/config/algorithms";
import { ArrayPage } from "@/components/visualizer/pages/array-page";
import { PathfindingPage } from "@/components/visualizer/pages/pathfinding-page";
import { GraphPage } from "@/components/visualizer/pages/graph-page";
import { MSTPage } from "@/components/visualizer/pages/mst-page";
import { AIPage } from "@/components/visualizer/pages/ai-page";
import { GamesPage } from "@/components/visualizer/pages/games-page";
import { ClassicPage } from "@/components/visualizer/pages/classic-page";

interface AlgoPageProps {
  params: Promise<{ category: string; algo: string }>;
}

export default function AlgoPage({ params }: AlgoPageProps) {
  const { category: categoryId, algo: algoId } = use(params);

  const category = findCategory(categoryId);
  const algorithm = findAlgorithm(categoryId, algoId);

  if (!category || !algorithm) {
    notFound();
  }

  const resolved = algorithm as Algorithm;

  if (categoryId === "path-finding") {
    return <PathfindingPage algoId={algoId} algorithm={resolved} />;
  }

  if (categoryId === "shortest-path") {
    return <GraphPage algoId={algoId} algorithm={resolved} />;
  }

  if (categoryId === "mst") {
    return <MSTPage algoId={algoId} algorithm={resolved} />;
  }

  if (categoryId === "ai") {
    return <AIPage algoId={algoId} algorithm={resolved} />;
  }

  if (categoryId === "games") {
    return <GamesPage algoId={algoId} algorithm={resolved} />;
  }

  if (categoryId === "classic") {
    return <ClassicPage algoId={algoId} algorithm={resolved} />;
  }

  return (
    <ArrayPage
      categoryId={categoryId as "sorting" | "searching"}
      algoId={algoId}
      algorithm={resolved}
    />
  );
}
