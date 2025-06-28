import { create } from "zustand";


interface SettingsState {
    isOpen: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setIsOpen: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isOpen: false,
  isDarkMode: false,
  setIsOpen: (value: boolean) => set({ isOpen: value }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
