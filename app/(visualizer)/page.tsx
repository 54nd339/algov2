import Link from "next/link";
import { categories } from "@/config/algorithms";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-10">
      {/* Hero */}
      <div className="text-center space-y-3 max-w-xl">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Algo<span className="text-algo-green">Viz</span>
        </h1>
        <p className="text-muted-foreground text-lg font-space">
          Interactive algorithm visualizer — explore, learn, and understand.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid gap-4 sm:grid-cols-2 w-full max-w-lg">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const firstAlgo = cat.algorithms[0];
          return (
            <Link
              key={cat.id}
              href={`/${cat.id}/${firstAlgo.id}`}
              className="group relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-algo-green/50 hover:shadow-lg hover:shadow-algo-green/5"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-algo-green/10 text-algo-green transition-colors group-hover:bg-algo-green/20">
                <Icon className="size-6" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                <p className="text-sm text-muted-foreground font-space">
                  {cat.algorithms.length} algorithms
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground font-space">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/54nd339"
          target="_blank"
          rel="noreferrer"
          className="text-algo-green hover:underline"
        >
          Sandeep Swain
        </a>
      </p>
    </div>
  );
}
