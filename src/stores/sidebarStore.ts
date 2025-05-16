import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  toggle: () => void;
  setIsOpen: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));
