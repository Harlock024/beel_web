import { useAuthStore } from "@/stores/useAuthStore";
import { SidebarList } from "./sidebar_list";
import { SidebarTask } from "./sidebar_task";
import { SidebarUser } from "./sidebar_user";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { user } = useAuthStore();
  return (
    <aside className="h-screen w-[320px] border-r border-gray-200 bg-white fixed left-0 top-0 flex flex-col justify-between">
      <div className=" h-full px-6 py-8">
        <h1 className="text-xl font-semibold text-black mb-8">Beel</h1>
        <nav className="h-full ">
          <section className="">
            <a href="/home" className="flex gap-2">
              <Home />
              Home
            </a>
          </section>
          <SidebarList />
        </nav>
      </div>
      {/* <div className="px-6 py-4">
        {user ? (
          <SidebarUser />
        ) : (
          <div className="text-center text-gray-500">
            Please log in to access your account.
          </div>
        )}
      </div> */}
    </aside>
  );
}
