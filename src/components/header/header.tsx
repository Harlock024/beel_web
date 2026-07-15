import { useSidebarStore } from "@/stores/sidebarStore";
import { Moon, PanelRight, Sun } from "lucide-react";
import { AvatarAction } from "../user/avatar_action";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function Header() {
  const { isOpen, toggle } = useSidebarStore();
  const { isDarkMode, toggleDarkMode } = useSettingsStore();

  return (
    <header
      className={`transition-all duration-300 ease-in-out  ${isOpen ? "hidden" : "w-auto flex justify-between  items-center    "}`}
    >
      <div className="flex gap-4 items-center   ">
        <h1 className="text-xl font-semibold text-foreground">Beel</h1>
        <button onClick={toggle}>
          <PanelRight />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-accent transition-colors"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <AvatarAction />
      </div>
    </header>
  );
}
