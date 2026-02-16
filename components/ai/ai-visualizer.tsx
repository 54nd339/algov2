"use client";

import { useMemo, useCallback } from "react";
import { scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { localPoint } from "@visx/event";
import type { AISnapshot, DataPoint } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/algorithms/ai";
import { useAIChartData } from "@/lib/hooks";

const PADDING = 40;

interface AIVisualizerProps {
  snapshot: AISnapshot | null;
  dataPoints: DataPoint[];
  onAddPoint?: (point: DataPoint) => void;
  disabled?: boolean;
}

interface AIChartProps extends AIVisualizerProps {
  width: number;
  height: number;
}

function AIChart({ snapshot, dataPoints, onAddPoint, disabled, width, height }: AIChartProps) {
  const { points, centroids, regressionLine, knnHighlight, getColor } = useAIChartData(snapshot, dataPoints);

  const xScale = useMemo(
    () => scaleLinear({ domain: [0, 100], range: [PADDING, width - PADDING] }),
    [width],
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: [0, 100], range: [height - PADDING, PADDING] }),
    [height],
  );

  const line = useMemo(() => {
    if (!regressionLine) return null;
    const { slope, intercept } = regressionLine;
    return { x1: xScale(0), y1: yScale(intercept), x2: xScale(100), y2: yScale(slope * 100 + intercept) };
  }, [regressionLine, xScale, yScale]);

  const handleClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!onAddPoint || disabled) return;
      const point = localPoint(event);
      if (!point) return;
      const x = Math.max(0, Math.min(100, xScale.invert(point.x)));
      const y = Math.max(0, Math.min(100, yScale.invert(point.y)));
      onAddPoint({ x, y });
    },
    [onAddPoint, disabled, xScale, yScale],
  );

  return (
    <svg width={width} height={height} onClick={handleClick}>
      <rect width={width} height={height} fill="transparent" />

      {/* Axes */}
      <line x1={PADDING} y1={height - PADDING} x2={width - PADDING} y2={height - PADDING} stroke="var(--muted-foreground)" strokeWidth={1} opacity={0.3} />
      <line x1={PADDING} y1={PADDING} x2={PADDING} y2={height - PADDING} stroke="var(--muted-foreground)" strokeWidth={1} opacity={0.3} />

      {/* Regression line */}
      {line && <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="var(--algo-red)" strokeWidth={2} strokeDasharray="6 3" />}

      {/* KNN neighbor connections */}
      {knnHighlight?.testPoint &&
        knnHighlight.neighbors.map((idx) => {
          const neighbor = knnHighlight.points[idx];
          if (!neighbor || !knnHighlight.testPoint) return null;
          return (
            <line
              key={`knn-${idx}`}
              x1={xScale(knnHighlight.testPoint.x)}
              y1={yScale(knnHighlight.testPoint.y)}
              x2={xScale(neighbor.x)}
              y2={yScale(neighbor.y)}
              stroke="var(--algo-yellow)"
              strokeWidth={1}
              strokeDasharray="4 2"
              opacity={0.6}
            />
          );
        })}

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r={4} fill={getColor(p)} opacity={0.8} />
      ))}

      {/* KNN test point */}
      {knnHighlight?.testPoint && (
        <circle cx={xScale(knnHighlight.testPoint.x)} cy={yScale(knnHighlight.testPoint.y)} r={7} fill="var(--algo-yellow)" stroke="var(--background)" strokeWidth={2} />
      )}

      {/* K-Means centroids */}
      {centroids.map((c, i) => {
        const cx = xScale(c.x);
        const cy = yScale(c.y);
        const color = CLUSTER_COLORS[i % CLUSTER_COLORS.length];
        return (
          <g key={`centroid-${i}`}>
            <circle cx={cx} cy={cy} r={8} fill="none" stroke={color} strokeWidth={3} />
            <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke={color} strokeWidth={2} />
            <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke={color} strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
}

export function AIVisualizer(props: AIVisualizerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? <AIChart {...props} width={width} height={height} /> : null
        }
      </ParentSize>
    </div>
  );
}
