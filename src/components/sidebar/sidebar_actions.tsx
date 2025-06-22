import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { ListForm } from "../list/list_form";
import { SettingsModal } from "../user/settings_modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";



export function SidebarActions() {
  const [newList, setIsNewList] = useState(false);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function HandletoggleNewList() {
    setIsNewList(!newList);
  }
  function HandlertoggleSetting() {
    setSettingOpen(!isSettingOpen);
  }
  function HandlerOnClomplete() {
    setIsNewList(false);
  }
  function HandlerSettingOncomplete() {
    setSettingOpen(false);
  }
  return (
    <div>
      <section className="flex justify-between items-center p-4 border-t">
        <h2>
          <button
            onClick={() => {
              HandletoggleNewList();
            }}
            className="flex items-center cursor-pointer text-sm text-gray-700 hover:text-gray-900"
          >
            <Plus className="w-4 h-4 mr-2 inline-block" />
            New List
          </button>
        </h2>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Settings2 />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <button
                  onClick={HandlertoggleSetting}
                  className="flex items-center gap-2"
                >
                  Settings
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a
                  href="/login"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  Logout
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      {newList && <ListForm isOpen={newList} onComplete={HandlerOnClomplete} />}
      {isSettingOpen && currentUser && (
        <SettingsModal
          isOpen={isSettingOpen}
          onComplete={HandlerSettingOncomplete}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
