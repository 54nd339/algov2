"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui";
import { type Category } from "@/config";

interface NavCategoryProps {
  category: Category;
  pathname: string;
}

export function NavCategory({ category, pathname }: NavCategoryProps) {
  const isCategoryActive = pathname.startsWith(`/${category.id}`);

  return (
    <Collapsible defaultOpen={isCategoryActive} className="border-2 border-border bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-algo-green/5">
        <span className={cn("font-space", isCategoryActive ? "text-algo-green" : "text-foreground")}>
          {category.name}
        </span>
        <ChevronDown className="size-3 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden transition-all duration-200 data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
        <div className="border-t border-border">
          {category.algorithms.map((algo) => {
            const href = `/${category.id}/${algo.id}`;
            const isActive = pathname === href;
            return (
              <Link
                key={algo.id}
                href={href}
                className={cn(
                  "block border-b border-border px-4 py-2 font-space text-sm uppercase tracking-wider transition-colors last:border-b-0",
                  isActive
                    ? "bg-algo-green text-background font-bold"
                    : "text-muted-foreground hover:bg-algo-green/5 hover:text-foreground",
                )}
              >
                {algo.name}
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
