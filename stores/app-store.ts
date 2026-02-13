import { create } from "zustand";

interface CurrentAlgo {
  categoryId: string;
  algoId: string;
  algoName: string;
}

interface AppState {
  sidebarOpen: boolean;
  desktopSidebarOpen: boolean;
  currentAlgo: CurrentAlgo | null;
}

interface AppActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleDesktopSidebar: () => void;
  setCurrentAlgo: (algo: CurrentAlgo | null) => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  sidebarOpen: false,
  desktopSidebarOpen: true,
  currentAlgo: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDesktopSidebar: () =>
    set((s) => ({ desktopSidebarOpen: !s.desktopSidebarOpen })),
  setCurrentAlgo: (algo) => set({ currentAlgo: algo }),
}));
