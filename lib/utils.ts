import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function barHeightPct(value: number, maxValue: number): number {
  return (value / Math.max(1, maxValue)) * 100;
}

export function formatAlgoName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Resolve bar fill & border classes from visualization status. */
export function barColors(status: "default" | "sorted" | "comparing" | "swapping" | "special"): { fill: string; border: string } {
  switch (status) {
    case "sorted":
      return { fill: "bg-bar-sorted", border: "border-t-bar-sorted-border" };
    case "comparing":
      return { fill: "bg-bar-comparing", border: "border-t-bar-comparing-border" };
    case "swapping":
      return { fill: "bg-bar-swapping", border: "border-t-bar-swapping-border" };
    case "special":
      return { fill: "bg-bar-special", border: "border-t-bar-special-border" };
    default:
      return { fill: "bg-bar-default", border: "border-t-bar-default-border" };
  }
}
