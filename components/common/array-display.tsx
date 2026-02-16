import type { AlgorithmSnapshot } from "@/lib/types";

interface ArrayDisplayProps {
  array: number[];
  snapshot: AlgorithmSnapshot | null;
  status?: "idle" | "running" | "done";
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  idle: { text: "Unsorted", color: "text-algo-red" },
  running: { text: "Sorting...", color: "text-algo-yellow" },
  done: { text: "Sorted", color: "text-algo-blue" },
};

export function ArrayDisplay({ array, snapshot, status }: ArrayDisplayProps) {
  const displayArray = snapshot?.array ?? array;
  const comparing: number[] = snapshot?.comparing ? [...snapshot.comparing] : [];
  const swapping: number[] = snapshot?.swapping ? [...snapshot.swapping] : [];

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-space text-sm">
      {displayArray.map((value, index) => {
        let color = "text-foreground/70";
        if (snapshot?.sorted?.includes(index)) {
          color = "text-algo-green";
        } else if (swapping.includes(index)) {
          color = "text-algo-purple";
        } else if (comparing.includes(index)) {
          color = "text-algo-red";
        } else if (snapshot?.special === index) {
          color = "text-algo-yellow";
        }

        return (
          <span key={index} className={color}>
            {value}
          </span>
        );
      })}
      {status && STATUS_LABEL[status] && (
        <span className={`ml-1 text-2xs uppercase tracking-wider ${STATUS_LABEL[status].color}`}>
          {STATUS_LABEL[status].text}
        </span>
      )}
    </div>
  );
}
