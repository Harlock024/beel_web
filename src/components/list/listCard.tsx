import { List } from "@/types/list";
import { useListStore } from "@/stores/list_store";
import { FormEvent, useState } from "react";
import { ListForm } from "./list_form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export function ListCard({ list }: { list: List }) {
  const [isEditingList, setIsEditingList] = useState(false);
  const { deleteList, setSelectedList, selectedListId } = useListStore();

  function handleListClick(e: FormEvent<HTMLAnchorElement>) {
    e.preventDefault(); // Corregido de e.defaultPrevented
    setSelectedList(list.id!);
  }

  const handleEditList = () => {
    setIsEditingList(!isEditingList);
  };

  const handleDeleteList = () => {
    deleteList(list.id!);
  };

  const isSelected = selectedListId === list.id;

  return (
    <div className="group relative">
      <a
        href={`/list/${list.id}`}
        onClick={handleListClick}
        className={cn(
          "flex items-center gap-3 px-3 py-1 rounded-md w-full justify-start transition-colors",
          isSelected 
            ? "bg-[#ececec] text-gray-900" 
            : "text-gray-700 hover:bg-[#ececec]"
        )}
        title={list.title}
      >
        <div
          className={cn(
            "w-3 h-3 rounded-full flex-shrink-0 transition-transform",
            isSelected ? "scale-110" : "hover:scale-100"
          )}
          style={{ backgroundColor: list.color }}
          title={`Color: ${list.color}`}
        ></div>
        <span className="flex-1 truncate select-none font-medium text-[14px]">
          {list.title}
        </span>   

        <div className="opacity-0 group-hover:opacity-500 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost"
                size="icon" 
                className="h-6 w-6 p-0" 
                onClick={(e) => e.stopPropagation()}
              >
                <Ellipsis className="h-4 w-4 cursor-pointer  hover:text-gray-950" />
               
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-40" 
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleEditList();
                }}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList();
                }}
                className="text-red-500 focus:text-red-500 focus:bg-red-50 flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </a>
      
      {isEditingList && (
        <ListForm
          list={list}
          onComplete={handleEditList}
          isOpen={isEditingList}
        />
      )}
    </div> 
  );
}