import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  isOpen: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setIsOpen: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isOpen: false,
      isDarkMode: false,
      setIsOpen: (value: boolean) => set({ isOpen: value }),
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDarkMode;
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next);
          }
          return { isDarkMode: next };
        }),
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode && typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);
