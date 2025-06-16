import { useEffect, useState } from "react";
import { SidebarList } from "./sidebar_list";
import { useAuthStore } from "@/stores/useAuthStore";
import { Home, PanelRight } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { SidebarActions } from "./sidebar_actions";
import { SidebarTask } from "./sidebar_task";

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
        className={`transition-all duration-300 ease-in-out border-r bg-white fixed md:static top-0 left-0 h-screen z-40
        ${isOpen ? "w-[256px]" : "w-0 overflow-hidden"}`}
      >
        <div className="h-full px-6 py-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-semibold text-black">Beel</h1>

              <div className="">
                <button onClick={toggle}>
                  <PanelRight className="w-6 h-6 rotate-180" />
                </button>
              </div>
            </div>
            <nav className="text-[14px]">
              <a
                href="/home"
                className="flex items-center gap-2 mb-4 text-gray-800 hover:text-black"
              >
                <Home />
                Home
              </a>
              <SidebarTask />
              <SidebarList />
            </nav>
          </div>
          {user ? (
            <SidebarActions />
          ) : (
            <div className="text-center text-gray-500">
              Please log in to access your account.
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
