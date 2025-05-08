import { List } from "@/types/list";
import { Label } from "../ui/label";
import { useListStore } from "@/stores/list_store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useState } from "react";
import { ModalEditTaskForm } from "./modal_list_form";

export function ListCard({
  list,
  selectedListId,
  handleListClick,
}: {
  list: List;
  selectedListId: string;
  handleListClick: (listId: string) => void;
}) {
  const [isEditingList, setIsEditingList] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);

  const handleEditList = () => {
    setIsEditingList(true);
  };

  const handleDeleteList = () => {
    setIsDeletingList(true);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <button
            key={list.id}
            onClick={() => handleListClick(list.id!)}
            className={`w-full flex items-center gap-2 text-sm px-3 py-2 rounded transition-colors
        ${
          selectedListId === list.id
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
          >
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: list.color }}
            ></div>
            <span className="truncate">{list.title}</span>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleEditList}>Edit List</ContextMenuItem>
          <ContextMenuItem onClick={handleDeleteList}>
            Delete List
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isEditingList && (
        <ModalEditTaskForm
          list={list}
          onClose={() => setIsEditingList(false)}
        />
      )}
    </>
  );
}
