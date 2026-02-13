"use client";

import { useMemo, type MouseEvent } from "react";
import type { AISnapshot, DataPoint } from "@/lib/types/ai";

/* ── Color palette ─────────────────────────────────────────────── */

const clusterColors = [
  "var(--algo-green)",
  "var(--algo-cyan)",
  "var(--algo-purple)",
  "var(--algo-yellow)",
  "var(--algo-red)",
  "var(--algo-blue)",
];

/* ── Main component ────────────────────────────────────────────── */

interface AIVisualizerProps {
  snapshot: AISnapshot | null;
  dataPoints: DataPoint[];
  onAddPoint?: (point: DataPoint) => void;
  disabled?: boolean;
}

export function AIVisualizer({ snapshot, dataPoints, onAddPoint, disabled }: AIVisualizerProps) {
  const width = 600;
  const height = 400;
  const padding = 40;

  // Scale data coordinates (0-100) to SVG coordinates
  const scaleX = (x: number) => padding + (x / 100) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - (y / 100) * (height - 2 * padding);

  const points = snapshot ? getPoints(snapshot) : dataPoints;
  const centroids = snapshot?.type === "k-means" ? snapshot.data.centroids : [];

  // Regression line
  const line = useMemo(() => {
    if (!snapshot) return null;
    if (snapshot.type === "regression") {
      const { slope, intercept } = snapshot.data;
      return {
        x1: scaleX(0),
        y1: scaleY(slope * 0 + intercept),
        x2: scaleX(100),
        y2: scaleY(slope * 100 + intercept),
      };
    }
    return null;
  }, [snapshot]);

  // KNN highlight
  const knnHighlight = snapshot?.type === "knn" ? snapshot.data : null;

  const handleAddPoint = (event: MouseEvent<SVGSVGElement>) => {
    if (!onAddPoint || disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const y = ((event.clientY - rect.top) / rect.height) * height;
    const rawX = Math.max(0, Math.min(100, ((x - padding) / (width - 2 * padding)) * 100));
    const rawY = Math.max(0, Math.min(100, ((height - padding - y) / (height - 2 * padding)) * 100));
    onAddPoint({ x: rawX, y: rawY });
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleAddPoint}
      >
        {/* Background */}
        <rect width={width} height={height} fill="transparent" />

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="var(--muted-foreground)"
          strokeWidth={1}
          opacity={0.3}
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="var(--muted-foreground)"
          strokeWidth={1}
          opacity={0.3}
        />



        {/* Regression line */}
        {line && (
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--algo-red)"
            strokeWidth={2}
            strokeDasharray="6 3"
          />
        )}

        {/* KNN neighbor connections */}
        {knnHighlight?.testPoint &&
          knnHighlight.neighbors.map((idx) => {
            const neighbor = knnHighlight.points[idx];
            if (!neighbor || !knnHighlight.testPoint) return null;
            return (
              <line
                key={`knn-${idx}`}
                x1={scaleX(knnHighlight.testPoint.x)}
                y1={scaleY(knnHighlight.testPoint.y)}
                x2={scaleX(neighbor.x)}
                y2={scaleY(neighbor.y)}
                stroke="var(--algo-yellow)"
                strokeWidth={1}
                strokeDasharray="4 2"
                opacity={0.6}
              />
            );
          })}

        {/* Data points */}
        {points.map((p, i) => {
          const color = getPointColor(p, snapshot?.type);
          return (
            <circle
              key={i}
              cx={scaleX(p.x)}
              cy={scaleY(p.y)}
              r={4}
              fill={color}
              opacity={0.8}
            />
          );
        })}

        {/* KNN test point */}
        {knnHighlight?.testPoint && (
          <circle
            cx={scaleX(knnHighlight.testPoint.x)}
            cy={scaleY(knnHighlight.testPoint.y)}
            r={7}
            fill="var(--algo-yellow)"
            stroke="var(--background)"
            strokeWidth={2}
          />
        )}

        {/* K-Means centroids */}
        {centroids.map((c, i) => (
          <g key={`centroid-${i}`}>
            <circle
              cx={scaleX(c.x)}
              cy={scaleY(c.y)}
              r={8}
              fill="none"
              stroke={clusterColors[i % clusterColors.length]}
              strokeWidth={3}
            />
            <line
              x1={scaleX(c.x) - 5}
              y1={scaleY(c.y)}
              x2={scaleX(c.x) + 5}
              y2={scaleY(c.y)}
              stroke={clusterColors[i % clusterColors.length]}
              strokeWidth={2}
            />
            <line
              x1={scaleX(c.x)}
              y1={scaleY(c.y) - 5}
              x2={scaleX(c.x)}
              y2={scaleY(c.y) + 5}
              stroke={clusterColors[i % clusterColors.length]}
              strokeWidth={2}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────── */

function getPoints(snapshot: AISnapshot): DataPoint[] {
  switch (snapshot.type) {
    case "regression":
      return snapshot.data.points;
    case "knn":
      return snapshot.data.points;
    case "k-means":
      return snapshot.data.points;
  }
}

function getPointColor(p: DataPoint, snapshotType?: string): string {
  if (snapshotType === "k-means" && p.predicted !== undefined) {
    return clusterColors[p.predicted % clusterColors.length];
  }
  if (snapshotType === "knn" && p.label !== undefined) {
    return clusterColors[p.label % clusterColors.length];
  }
  return "var(--algo-green)";
}
