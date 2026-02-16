"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories } from "@/config";
import { ScrollArea } from "@/components/ui";
import { SidebarHeader } from "./sidebar-header";
import { SidebarFooter } from "./sidebar-footer";
import { NavCategory } from "./sidebar-nav-category";

/** Shared navigation list — rendered in both desktop sidebar and mobile sheet. */
function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {categories.map((cat) => (
        <NavCategory key={cat.id} category={cat} pathname={pathname} />
      ))}
    </nav>
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
      <ScrollArea className="flex-1 px-2 py-2">
        <SidebarNav />
      </ScrollArea>
      <SidebarFooter />
    </aside>
  );
}

/** Used inside the mobile Sheet — same nav, different scroll wrapper. */
export function SidebarContent() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <SidebarHeader />
      <ScrollArea className="flex-1 min-h-0 px-2 py-2">
        <SidebarNav />
      </ScrollArea>
      <SidebarFooter />
    </div>
  );
}
