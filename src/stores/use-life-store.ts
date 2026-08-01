import { create } from "zustand";

interface LifeUIState {
  isLogModalOpen: boolean;
  setLogModalOpen: (open: boolean) => void;
}

export const useLifeStore = create<LifeUIState>((set) => ({
  isLogModalOpen: false,
  setLogModalOpen: (open) => set({ isLogModalOpen: open }),
}));
