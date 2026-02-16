"use client";

import { Menu, Moon, Sun, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/stores";
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui";
import { SidebarContent } from "./sidebar";

export function Header() {
  /** Single selector prevents re-renders when unrelated store slices change. */
  const { currentAlgo, sidebarOpen, setSidebarOpen, desktopSidebarOpen, toggleDesktopSidebar } =
    useAppStore(
      useShallow((s) => ({
        currentAlgo: s.currentAlgo,
        sidebarOpen: s.sidebarOpen,
        setSidebarOpen: s.setSidebarOpen,
        desktopSidebarOpen: s.desktopSidebarOpen,
        toggleDesktopSidebar: s.toggleDesktopSidebar,
      })),
    );

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
          <span className="h-9 w-2.5 bg-algo-green" aria-hidden />
          <h2 className="font-space text-lg font-bold uppercase tracking-widest text-foreground leading-none">
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
