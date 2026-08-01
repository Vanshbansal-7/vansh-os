import { create } from "zustand";

interface MissionUIState {
  isFocusModeOpen: boolean;
  setFocusModeOpen: (open: boolean) => void;
}

export const useMissionStore = create<MissionUIState>((set) => ({
  isFocusModeOpen: false,
  setFocusModeOpen: (open) => set({ isFocusModeOpen: open }),
}));
