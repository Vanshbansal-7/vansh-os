import { create } from "zustand";

interface CareerUIState {
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useCareerStore = create<CareerUIState>((set) => ({
  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
