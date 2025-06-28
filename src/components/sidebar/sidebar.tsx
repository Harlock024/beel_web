import { useEffect, useState } from "react";
import { SidebarList } from "./sidebar_list";
import { useAuthStore } from "@/stores/useAuthStore";
import { Home, PanelRight } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { SidebarActions } from "./sidebar_actions";
import { SidebarTask } from "./sidebar_task";
import { AvatarAction } from "../user/avatar_action";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user } = useAuthStore();
  const { isOpen, toggle, setIsOpen } = useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      const shouldShow = window.innerWidth >= 768;
      setIsOpen(shouldShow);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  return (
    <>
      <aside
        className={`transition-all duration-300 ease-in-out border-r bg-[#f8f8f6] fixed md:static top-0 left-0 h-screen z-40
        ${isOpen ? "w-[256px]" : "w-0 overflow-hidden"}`}
      >
        <div className="h-full w-full px-2 py-1 gap-4 flex flex-col "> 
          <SidebarHeader  />
          
          <SidebarTask />
          <SidebarList />

        </div>
      </aside>
    </>
  );
}

function SidebarHeader({className}:{className?:string}) {
  return (
    <header className={cn(className,"flex flex-col w-full items-between")}>
      <div className="flex  hover:bg-[#ececec]  rounded-md   justify-between   w-full">
        <AvatarAction/>
        <button onClick={() => useSidebarStore.getState().toggle()}>
          <PanelRight className="w-5  h-5" />
        </button>
        </div>
      <h1 className="text-xl font-bold text-black mt-5">Beel</h1>
    </header>
  );
}
