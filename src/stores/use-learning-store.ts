import { create } from "zustand";

interface LearningUIState {
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useLearningStore = create<LearningUIState>((set) => ({
  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
