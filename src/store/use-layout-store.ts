import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutState {
  leftSidebarVisible: boolean;
  rightSidebarVisible: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLeftSidebar: (visible: boolean) => void;
  setRightSidebar: (visible: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      leftSidebarVisible: true,
      rightSidebarVisible: true,
      toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarVisible: !state.leftSidebarVisible })),
      toggleRightSidebar: () =>
        set((state) => ({ rightSidebarVisible: !state.rightSidebarVisible })),
      setLeftSidebar: (visible) => set({ leftSidebarVisible: visible }),
      setRightSidebar: (visible) => set({ rightSidebarVisible: visible }),
    }),
    {
      name: "vos-layout-storage",
    }
  )
);
