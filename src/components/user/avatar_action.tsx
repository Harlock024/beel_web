import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function AvatarAction() {
  const { user, logout } = useAuthStore();
  const { setIsOpen } = useSettingsStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger>
        <button className="flex select-none items-center gap-2 px-2 rounded-md w-full justify-start text-foreground transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback className="text-sm">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user.username}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.username}</span>
              <span className="text-xs text-muted-foreground">{user.email || 'No email provided'}</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setDropdownOpen(false);
                setIsOpen(true);
              }}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
