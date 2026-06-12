import { useEffect, useState } from "react";
import { SidebarList } from "./sidebar_list";
import { useAuthStore } from "@/stores/useAuthStore";
import { PanelRight, Tags } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { SidebarTask } from "./sidebar_task";
import { SidebarSearch } from "./sidebar_search";
import { AvatarAction } from "../user/avatar_action";
import { cn } from "@/lib/utils";
import { SidebarFiltersTags } from "./sidebar_filters_tags";

export default function Sidebar() {
  const { user } = useAuthStore();
  const { isOpen, toggle, setIsOpen } = useSidebarStore();
  const [showFiltersTags, setShowFiltersTags] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const shouldShow = window.innerWidth >= 768;
      setIsOpen(shouldShow);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  if (showFiltersTags) {
    return (
      <aside
        className={`transition-all duration-300 ease-in-out border-r bg-sidebar fixed md:static top-0 left-0 h-screen z-40
        ${isOpen ? "w-[256px]" : "w-0 overflow-hidden"}`}
      >
        <div className="h-full w-full min-w-0">
          <SidebarFiltersTags onClose={() => setShowFiltersTags(false)} />
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside
        className={`transition-all duration-300 ease-in-out border-r bg-sidebar fixed md:static top-0 left-0 h-screen z-40
        ${isOpen ? "w-[256px]" : "w-0 overflow-hidden"}`}
      >
        <div className="h-full w-full px-2 py-1 gap-4 flex flex-col overflow-hidden min-w-0"> 
          <SidebarHeader  />
          
          <SidebarTask />
          <SidebarSearch />
          <SidebarList />

          <div className="mt-auto px-2 pb-2">
            <button
              onClick={() => setShowFiltersTags(true)}
              className="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground py-1.5 px-2 rounded-md hover:bg-accent transition-colors"
            >
              <Tags className="h-4 w-4" />
              Filters & Tags
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarHeader({className}:{className?:string}) {
  return (
    <header className={cn(className,"flex flex-col w-full items-between")}>
      <div className="flex  hover:bg-accent  rounded-md   justify-between   w-full">
        <AvatarAction/>
        <button onClick={() => useSidebarStore.getState().toggle()}>
          <PanelRight className="w-5  h-5" />
        </button>
        </div>
    </header>
  );
}
