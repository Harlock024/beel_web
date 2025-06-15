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
      <ContextMenu>
        <ContextMenuTrigger>
          <a
            href={`/list/${list.id}`}
            onClick={handleListClick}
            className={[
              "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all truncate ",
              isSelected ? "bg-gray-200 " : "hover:bg-gray-200 ",
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
          </a>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={handleEditList}>Edit List</ContextMenuItem>
          <ContextMenuItem onClick={handleDeleteList}>
            Delete List
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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
