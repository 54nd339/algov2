import Link from "next/link";
import { categories } from "@/config";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-10">
      <div className="text-center space-y-3 max-w-xl">
        <h1 className="text-5xl font-bold tracking-tight font-unica sm:text-6xl">
          Algo<span className="text-algo-green">Viz</span>
        </h1>
        <p className="text-muted-foreground text-sm font-space uppercase tracking-widest">
          Interactive algorithm visualizer
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 w-full max-w-lg">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const firstAlgo = cat.algorithms[0];
          return (
            <Link
              key={cat.id}
              href={`/${cat.id}/${firstAlgo.id}`}
              className="group flex flex-col items-center gap-3 border-2 border-border bg-card p-6 transition-colors hover:border-algo-green"
            >
              <div className="flex size-10 items-center justify-center border border-border bg-background text-algo-green transition-colors group-hover:bg-algo-green group-hover:text-background">
                <Icon className="size-5" />
              </div>
              <div className="text-center font-space uppercase">
                <h2 className="text-sm font-bold tracking-widest">{cat.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {cat.algorithms.length} algorithms
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
