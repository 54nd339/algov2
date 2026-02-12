import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block md:w-64 lg:w-72 shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
