"use client";

import { format } from "date-fns";
import { Github, Menu, X } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  const currentAlgo = useAppStore((s) => s.currentAlgo);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const displayName = currentAlgo?.algoName ?? "Home";
  const dateStr = format(new Date(), "MM/dd");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* ── Left: Date + Algo Name ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span
          suppressHydrationWarning
          className="hidden sm:block font-space text-sm text-algo-green"
        >
          {dateStr}
        </span>
        <div className="hidden sm:block h-6 w-2 rounded-sm bg-algo-cyan" />
        <h2 className="font-space text-lg uppercase tracking-wide text-foreground leading-none">
          {displayName}
        </h2>
      </div>

      {/* ── Right: GitHub + Mobile Menu ─────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/54nd339/algoviz"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github className="size-5 text-muted-foreground" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View source on GitHub</TooltipContent>
        </Tooltip>

        {/* Mobile sidebar trigger */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
