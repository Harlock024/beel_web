import { useEffect, useState } from "react";
import { SidebarList } from "./sidebar_list";
import { AvatarAction } from "../user/avatar_action";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  ChevronsLeft,
  ChevronsRight,
  Dock,
  DoorClosedLocked,
  Home,
  PanelRight,
  Pin,
  PinOff,
} from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";

export default function Sidebar() {
  const { user } = useAuthStore();
  const { isOpen, toggle } = useSidebarStore();
  return (
    <>
      <aside
        className={`transition-all duration-300 ease-in-out   border-r
        ${isOpen ? "w-[320px] bg-white" : "hidden"}`}
      >
        <div className="h-full px-6 py-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-semibold text-black">Beel</h1>
              <div>
                <button onClick={toggle}>
                  <PanelRight />
                </button>
              </div>
            </div>
            <nav>
              <a
                href="/home"
                className="flex items-center gap-2 mb-4 text-gray-800 hover:text-black"
              >
                <Home />
                Home
              </a>
              <SidebarList />
            </nav>
          </div>
          {user ? (
            <AvatarAction />
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
