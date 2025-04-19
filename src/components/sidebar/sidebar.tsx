import { useAuthStore } from "@/stores/useAuthStore";
import { SidebarList } from "./sidebar_list";
import { SidebarTask } from "./sidebar_task";
import { SidebarUser } from "./sidebar_user";

export default function Sidebar() {
  const { user } = useAuthStore();
  return (
    <aside className="h-screen w-64 border-r border-gray-200 bg-white fixed left-0 top-0 flex flex-col justify-between">
      <div className="px-6 py-8">
        <h1 className="text-xl font-semibold text-black mb-8">Beel</h1>

        <nav className="space-y-6">
          <SidebarTask className="" />
          <SidebarList />

          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
              Tags
            </h2>
          </div>
        </nav>
      </div>
      <div className="px-6 py-4">
        {user ? (
          <SidebarUser />
        ) : (
          <div className="text-center text-gray-500">
            Please log in to access your account.
          </div>
        )}
      </div>
    </aside>
  );
}
