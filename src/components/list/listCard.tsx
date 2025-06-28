import { List } from "@/types/list";
import { useListStore } from "@/stores/list_store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { FormEvent, useState } from "react";
import { ListForm } from "./list_form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

export function ListCard({ list }: { list: List }) {
  const [isEditingList, setIsEditingList] = useState(false);
  const { deleteList, setSelectedList, selectedListId } = useListStore();

  function handleListClick(e: FormEvent<HTMLAnchorElement>) {
    e.defaultPrevented;
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
    <>
        <a
            href={`/list/${list.id}`}
            onClick={handleListClick}
            className={[
              " flex items-center gap-2 px-2 rounded-md w-full justify-start  hover:bg-[#ECECEC] transition-color ",
              isSelected ? "bg-[#ECECEC]  " : "",
              "text-gray-700",
            ].join(" ")}
            title={list.title}
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: list.color }}
              title={`Color: ${list.color}`}
            ></div>
            <span className="flex-1 truncate font-medium">{list.title}</span>   
        <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => e.stopPropagation()}
              >
                <Ellipsis className="h-5 w-5 text-black hover:text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-48" 
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleEditList();
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                
                  handleDeleteList();
                }}
                className="text-red-500 focus:text-red-500"
              >
                Delete
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
    </> 
  );
}