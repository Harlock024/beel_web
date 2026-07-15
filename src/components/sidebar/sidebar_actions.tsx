import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { ListForm } from "../list/list_form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function SidebarActions() {
  const [newList, setIsNewList] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  function HandletoggleNewList() {
    setIsNewList(!newList);
  }
  function HandlerOnClomplete() {
    setIsNewList(false);
  }
  return (
    <div>
      <section className="flex justify-between items-center p-4 border-t">
        <h2>
          <button
            onClick={() => {
              HandletoggleNewList();
            }}
            className="flex items-center cursor-pointer text-sm text-foreground/80 hover:text-foreground"
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
                  onClick={() => useSettingsStore.getState().setIsOpen(true)}
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
    </div>
  );
}
