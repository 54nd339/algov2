"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { categories } from "@/config/algorithms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

function SidebarHeader() {
  return (
    <div className="border-b border-border px-6 py-6">
      <p className="font-space text-xs text-muted-foreground">v2.0.0</p>
      <Link href="/" className="block">
        <h1 className="font-unica text-5xl tracking-tight leading-tight">
          AlgoViz
        </h1>
      </Link>
      <p className="font-space text-xs text-muted-foreground">
        Algorithm Visualizer
      </p>
    </div>
  );
}

function NavCategory({
  category,
  pathname,
}: {
  category: (typeof categories)[number];
  pathname: string;
}) {
  const isCategoryActive = pathname.startsWith(`/${category.id}`);
  const [isOpen, setIsOpen] = useState(isCategoryActive);

  const Icon = category.icon;

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isCategoryActive && "text-algo-green",
        )}
      >
        <span className="flex items-center gap-2">
          <Icon className="size-4" />
          {category.name}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-4 border-l border-border pl-2 space-y-0.5">
              {category.algorithms.map((algo) => {
                const href = `/${category.id}/${algo.id}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={algo.id}
                    href={href}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-algo-green/10 text-algo-green font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {algo.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarFooter() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="border-t border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div
          suppressHydrationWarning
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          <span className="font-space text-xs">
            {isDark ? "Dark" : "Light"}
          </span>
        </div>
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle dark mode"
        />
      </div>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-background border-r border-border",
        className,
      )}
    >
      <SidebarHeader />

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1">
          {categories.map((cat) => (
            <NavCategory key={cat.id} category={cat} pathname={pathname} />
          ))}
        </nav>
      </ScrollArea>

      <SidebarFooter />
    </aside>
  );
}

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <SidebarHeader />

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1">
          {categories.map((cat) => (
            <NavCategory key={cat.id} category={cat} pathname={pathname} />
          ))}
        </nav>
      </ScrollArea>

      <SidebarFooter />
    </div>
  );
}
