import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findAlgorithm, findCategory } from "@/config";
import {
  ArrayPage,
  PathfindingPage,
  GraphPage,
  MSTPage,
  AIPage,
  GamesPage,
  ClassicPage,
  PerceptronPage,
} from "@/components/visualizer/pages";

interface AlgoPageProps {
  params: Promise<{ category: string; algo: string }>;
}

export async function generateMetadata({ params }: AlgoPageProps): Promise<Metadata> {
  const { category, algo } = await params;
  const algorithm = findAlgorithm(category, algo);
  if (!algorithm) return {};
  return {
    title: algorithm.name,
    description: algorithm.description,
    openGraph: {
      title: `${algorithm.name} | AlgoViz`,
      description: algorithm.description,
      url: `/${category}/${algo}`,
      siteName: "AlgoViz",
    },
  };
}

export default async function AlgoPage({ params }: AlgoPageProps) {
  const { category: categoryId, algo: algoId } = await params;

  const category = findCategory(categoryId);
  const algorithm = findAlgorithm(categoryId, algoId);

  if (!category || !algorithm) {
    notFound();
  }

  if (categoryId === "path-finding") {
    return <PathfindingPage algoId={algoId} algorithm={algorithm} />;
  }

  if (categoryId === "shortest-path") {
    return <GraphPage algoId={algoId} algorithm={algorithm} />;
  }

  if (categoryId === "mst") {
    return <MSTPage algoId={algoId} algorithm={algorithm} />;
  }

  if (categoryId === "ai") {
    if (algoId === "perceptron") {
      return <PerceptronPage algoId={algoId} algorithm={algorithm} />;
    }
    return <AIPage algoId={algoId} algorithm={algorithm} />;
  }

  if (categoryId === "games") {
    return <GamesPage algoId={algoId} algorithm={algorithm} />;
  }

  if (categoryId === "classic") {
    return <ClassicPage algoId={algoId} algorithm={algorithm} />;
  }

  return (
    <ArrayPage
      categoryId={categoryId as "sorting" | "searching"}
      algoId={algoId}
      algorithm={algorithm}
    />
  );
}
