"use client";

import { Sidebar, Header } from "@/components/layout";
import { useAppStore } from "@/stores";

export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const desktopSidebarOpen = useAppStore((s) => s.desktopSidebarOpen);

  return (
    <div className="flex min-h-screen">
      <div
        className="hidden md:block shrink-0 sticky top-0 h-screen overflow-hidden transition-[width] duration-300 ease-in-out"
        style={{ width: desktopSidebarOpen ? undefined : 0 }}
        data-open={desktopSidebarOpen}
      >
        <div className="h-full w-64 md:w-72">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-x-hidden p-2 md:p-3">{children}</main>
      </div>
    </div>
  );
}
