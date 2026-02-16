"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

/** Runs Shiki syntax highlighting asynchronously and returns the resulting HTML string. */
export function useSyntaxHighlight(sourceCode: string): string {
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

  return html;
}
