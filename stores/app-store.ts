import { create } from "zustand";

interface CurrentAlgo {
  categoryId: string;
  algoId: string;
  algoName: string;
}

interface AppState {
  /** Mobile sidebar open/close state */
  sidebarOpen: boolean;
  /** Currently active algorithm (null on home page) */
  currentAlgo: CurrentAlgo | null;
}

interface AppActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCurrentAlgo: (algo: CurrentAlgo | null) => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  // ── State ────────────────────────────────────────────────────────────────
  sidebarOpen: false,
  currentAlgo: null,

  // ── Actions ──────────────────────────────────────────────────────────────
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCurrentAlgo: (algo) => set({ currentAlgo: algo }),
}));
