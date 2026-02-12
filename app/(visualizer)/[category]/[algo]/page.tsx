"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { findAlgorithm, findCategory } from "@/config/algorithms";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AlgoPageProps {
  params: Promise<{ category: string; algo: string }>;
}

export default function AlgoPage({ params }: AlgoPageProps) {
  const { category: categoryId, algo: algoId } = use(params);
  const setCurrentAlgo = useAppStore((s) => s.setCurrentAlgo);

  const category = findCategory(categoryId);
  const algorithm = findAlgorithm(categoryId, algoId);

  useEffect(() => {
    if (category && algorithm) {
      setCurrentAlgo({
        categoryId: category.id,
        algoId: algorithm.id,
        algoName: algorithm.name,
      });
    }

    return () => setCurrentAlgo(null);
  }, [categoryId, algoId, category, algorithm, setCurrentAlgo]);

  if (!category || !algorithm) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Visualizer Placeholder */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-space text-lg">
            {algorithm.name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              / {category.name}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[50vh] items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
            <div className="text-center space-y-2">
              <p className="text-2xl font-space text-algo-green">⚡</p>
              <p className="text-muted-foreground font-space text-sm">
                Visualizer — coming soon
              </p>
              <p className="text-xs text-muted-foreground">
                Controls, animated bars, stats, and code view will live here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
