import { useEffect, useState } from "react";
import { SidebarList } from "./sidebar_list";
import { SidebarUser } from "./sidebar_user";
import { useAuthStore } from "@/stores/useAuthStore";
import { ChevronsLeft, ChevronsRight, Home, Pin, PinOff } from "lucide-react";

export default function Sidebar() {
  const [locked, setLocked] = useState(false);
  const [hover, setHovered] = useState(false);
  const { user } = useAuthStore();
  const visible = locked || hover;

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) {
      main.style.marginLeft = visible ? "320px" : "0px";
    }
  }, [visible]);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-screen w-8 z-40"
        onMouseEnter={() => setHovered(true)}
      />

      <div
        className="fixed top-0 left-0 h-screen z-50 flex"
        onMouseLeave={() => setHovered(false)}
      >
        <aside
          className={`transition-all duration-300 ease-in-out h-full bg-white border-r shadow
            ${visible ? "w-[320px]" : "w-0 overflow-hidden"}`}
        >
          <div className="h-full px-6 py-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-semibold text-black">Beel</h1>
                <button
                  className="text-gray-500 hover:text-black"
                  onClick={() => setLocked(!locked)}
                >
                  {locked ? (
                    <ChevronsLeft size={20} />
                  ) : (
                    <ChevronsRight size={20} />
                  )}
                </button>
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
              <SidebarUser />
            ) : (
              <div className="text-center text-gray-500">
                Please log in to access your account.
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
