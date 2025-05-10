import { useSidebarStore } from "@/stores/sidebarStore";
import { PanelRight } from "lucide-react";
import { AvatarAction } from "../user/avatar_action";

export function Header() {
  const { isOpen, toggle } = useSidebarStore();
  return (
    <header
      className={`transition-all duration-300 ease-in-out  ${isOpen ? "hidden" : "w-auto flex justify-between  items-center    "}`}
    >
      <div className="flex gap-4 items-center   ">
        <h1 className="text-xl font-semibold text-black">Beel</h1>
        <button onClick={toggle}>
          <PanelRight />
        </button>
      </div>

      <AvatarAction />
    </header>
  );
}
