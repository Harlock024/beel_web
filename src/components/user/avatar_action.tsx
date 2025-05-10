import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dropdown } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export function AvatarAction() {
  const { user } = useAuthStore();
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-[#292929] hover:text-white rounded-md py-1"
        asChild
      >
        <div className="flex justify-center items-center gap-2">
          <Avatar className="sidebar-user">
            <AvatarImage className="size-10" src={user.avatar_url} alt="User" />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="sidebar-user-info">
            <h3 className="sidebar-user-name">{user.username}</h3>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a className="flex" href="/profile">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <a className="flex" href="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}
