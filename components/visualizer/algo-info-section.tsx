"use client";

import type { Algorithm } from "@/config/algorithms";
import { InfoPanel } from "@/components/common/info-panel";
import { CodeDisplay } from "@/components/common/code-display";
import { ComplexityPanel } from "@/components/common/complexity-panel";

interface AlgoInfoSectionProps {
  algorithm: Algorithm;
}

export function AlgoInfoSection({ algorithm }: AlgoInfoSectionProps) {
  return (
    <>
      <div className="border border-border bg-card py-5 text-center">
        <h2 className="font-space text-lg font-bold uppercase tracking-widest text-foreground">
          More About {algorithm.name}
        </h2>
      </div>
      <InfoPanel
        leftContent={
          <CodeDisplay
            description={algorithm.description}
            pseudocode={algorithm.pseudocode}
            sourceCode={algorithm.sourceCode}
          />
        }
        rightContent={<ComplexityPanel algorithm={algorithm} />}
      />
    </>
  );
}
