"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider, Toaster } from "@/components/ui";
import NextTopLoader from "nextjs-toploader";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        <NextTopLoader color="var(--algo-green)" showSpinner={false} />
        {children}
        <Toaster richColors position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
