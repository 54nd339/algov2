import Link from "next/link";
import { APP_VERSION } from "@/config";

export function SidebarHeader() {
  return (
    <div className="border-b-2 border-border px-4 py-5">
      <p className="font-space text-2xs uppercase tracking-widest text-algo-green/60">
        {APP_VERSION}
      </p>
      <Link href="/" className="block">
        <h1 className="font-unica text-4xl tracking-tight leading-tight text-foreground">
          AlgoViz
        </h1>
      </Link>
      <p className="font-space text-2xs uppercase tracking-widest text-muted-foreground">
        Algorithm Visualizer
      </p>
    </div>
  );
}
