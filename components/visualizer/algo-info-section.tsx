import type { Algorithm } from "@/config";
import { InfoPanel, CodeDisplay, ComplexityPanel } from "@/components/common";

interface AlgoInfoSectionProps {
  algorithm: Algorithm;
}

export function AlgoInfoSection({ algorithm }: AlgoInfoSectionProps) {
  return (
    <>
      <div className="flex h-28 items-center justify-center border border-border bg-algo-green/10">
        <h2 className="font-space text-xl font-bold uppercase tracking-widest text-foreground md:text-2xl">
          More About {algorithm.name}
        </h2>
      </div>
      <InfoPanel
        leftContent={
          <CodeDisplay
            description={algorithm.description}
            sourceCode={algorithm.sourceCode}
          />
        }
        rightContent={<ComplexityPanel algorithm={algorithm} />}
      />
    </>
  );
}
