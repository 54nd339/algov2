"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories } from "@/config/algorithms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarHeader } from "./sidebar-header";
import { SidebarFooter } from "./sidebar-footer";
import { NavCategory } from "./sidebar-nav-category";

function SidebarNav() {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1 px-2 py-2">
      <nav className="space-y-2">
        {categories.map((cat) => (
          <NavCategory key={cat.id} category={cat} pathname={pathname} />
        ))}
      </nav>
    </ScrollArea>
  );
}

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex h-screen min-h-0 flex-col bg-background border-r-2 border-border",
        className,
      )}
    >
      <SidebarHeader />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}

export function SidebarContent() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <SidebarHeader />
      <ScrollArea className="flex-1 min-h-0 px-2 py-2">
        <SidebarNavInner />
      </ScrollArea>
      <SidebarFooter />
    </div>
  );
}

function SidebarNavInner() {
  const pathname = usePathname();
  return (
    <nav className="space-y-2">
      {categories.map((cat) => (
        <NavCategory key={cat.id} category={cat} pathname={pathname} />
      ))}
    </nav>
  );
}
