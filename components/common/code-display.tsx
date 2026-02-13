"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeDisplayProps {
  description: string;
  pseudocode: string;
  sourceCode: string;
}

export function CodeDisplay({
  description,
  sourceCode,
}: CodeDisplayProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;
    codeToHtml(sourceCode, { lang: "typescript", theme: "vitesse-dark" }).then(
      (result) => {
        if (!cancelled) setHtml(result);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [sourceCode]);

  return (
    <div className="space-y-4 font-space uppercase">
      <div>
        <h3 className="mb-2 text-xs font-bold tracking-widest text-algo-cyan">
          About
        </h3>
        <p className="text-xs normal-case leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold tracking-widest text-algo-cyan">
          Source Code
        </h3>
        {html ? (
          <div
            className="max-h-[24rem] overflow-auto border border-border bg-card text-xs normal-case [&_pre]:!bg-transparent [&_pre]:p-3 [&_code]:font-mono [&_.line]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="border border-border bg-card p-3 text-xs normal-case text-muted-foreground">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
