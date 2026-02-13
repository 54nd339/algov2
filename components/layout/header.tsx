"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
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
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function Header() {
  const currentAlgo = useAppStore((s) => s.currentAlgo);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const desktopSidebarOpen = useAppStore((s) => s.desktopSidebarOpen);
  const toggleDesktopSidebar = useAppStore((s) => s.toggleDesktopSidebar);

  const { theme, setTheme } = useTheme();
  const displayName = currentAlgo?.algoName ?? "Home";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDesktopSidebar}
          className="hidden md:inline-flex group"
          aria-label="Toggle sidebar"
        >
          {desktopSidebarOpen ? (
            <PanelLeftClose className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          ) : (
            <PanelLeftOpen className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          )}
        </Button>
        <div className="flex items-center gap-3">
          <span className="h-7 w-2 bg-algo-cyan" aria-hidden />
          <h2 className="font-space text-base font-bold uppercase tracking-widest text-foreground leading-none">
            {displayName}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="group"
          suppressHydrationWarning
        >
          <Sun className="size-5 rotate-0 scale-100 text-muted-foreground transition-all duration-300 group-hover:text-foreground dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 text-muted-foreground transition-all duration-300 group-hover:text-foreground dark:rotate-0 dark:scale-100" />
        </Button>

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
