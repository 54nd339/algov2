"use client";

import { Skeleton } from "@/components/ui";
import { useSyntaxHighlight } from "@/lib/hooks";

interface CodeDisplayProps {
  description: string;
  sourceCode: string;
}

export function CodeDisplay({ description, sourceCode }: CodeDisplayProps) {
  const html = useSyntaxHighlight(sourceCode);

  return (
    <div className="space-y-4 font-space uppercase">
      <div>
        <h3 className="mb-2 text-xs font-bold tracking-widest text-algo-green">
          About
        </h3>
        <p className="text-xs normal-case leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold tracking-widest text-algo-green">
          Source Code
        </h3>
        {html ? (
          <div className="max-h-96 overflow-auto border border-border bg-card">
            <div
              className="text-xs normal-case [&_pre]:!bg-transparent [&_pre]:p-3 [&_code]:font-mono [&_.line]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ) : (
          <Skeleton className="h-48 w-full rounded-none" />
        )}
      </div>
    </div>
  );
}
