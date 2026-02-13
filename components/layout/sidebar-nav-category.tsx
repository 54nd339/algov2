"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Category } from "@/config/algorithms";

interface NavCategoryProps {
  category: Category;
  pathname: string;
}

function useReducedMotion() {
  return useSyncExternalStore(
    (subscribe) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", subscribe);
      return () => mediaQuery.removeEventListener("change", subscribe);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function NavCategory({ category, pathname }: NavCategoryProps) {
  const isCategoryActive = pathname.startsWith(`/${category.id}`);
  const [isOpen, setIsOpen] = useState(isCategoryActive);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="border-2 border-border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-accent"
      >
        <span className={cn("font-space", isCategoryActive ? "text-algo-green" : "text-foreground")}>
          {category.name}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
        >
          <ChevronDown className="size-3 text-muted-foreground" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: "easeInOut" }
            }
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {category.algorithms.map((algo) => {
                const href = `/${category.id}/${algo.id}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={algo.id}
                    href={href}
                    className={cn(
                      "block border-b border-border px-4 py-1.5 font-space text-xs uppercase tracking-wider transition-colors last:border-b-0",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
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
