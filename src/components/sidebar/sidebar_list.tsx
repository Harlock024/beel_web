import { useListStore } from "@/stores/list_store";
import { List as ListIcon, Plus } from "lucide-react";
import { useFiltersStore } from "@/stores/useFilterStore";
import { FormEvent, useEffect, useState } from "react";
import { ListForm } from "../list/list_form";
import { Button } from "../ui/button";
import { List } from "@/types/list";
import { ScrollArea } from "../ui/scroll-area";

function ListCard({
  list,
  selectedListId,
  handleListClick,
}: {
  list: List;
  selectedListId: string | undefined;
  handleListClick: (listId: string) => void;
}) {
  return (
    <button
      key={list.id}
      onClick={() => handleListClick(list.id)}
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
  );
}

export function SidebarList() {
  const { lists, fetchLists } = useListStore();
  const [isToggleForm, setToggleForm] = useState(false);
  const { filterTasks } = useFiltersStore();
  const [selectedListId, setSelectedListId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchLists();
  }, []);

  const handleToggleForm = (e: FormEvent) => {
    e.preventDefault();
    setToggleForm(!isToggleForm);
  };

  const handleListClick = (listId: string) => {
    const newSelected = selectedListId === listId ? undefined : listId;
    setSelectedListId(newSelected);
    filterTasks({ listId: newSelected });
  };

  return (
    <div className="h-full flex flex-col  justify-start">
      <div className="py-2 px-1">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Lists
          </h2>
        </div>

        <div className="space-y-1  overflow-y-auto pr-1">
          <ScrollArea>
            {lists.length === 0 ? (
              <div className="text-sm text-gray-400 py-1">No hay listas</div>
            ) : (
              lists.map((list, index) => (
                <ListCard
                  key={index}
                  list={list}
                  selectedListId={selectedListId}
                  handleListClick={handleListClick}
                />
              ))
            )}
          </ScrollArea>
        </div>
      </div>

      <div className="flex border-t h-full items-end justify-center mb-5 border-gray-200 px-4 py-4">
        {isToggleForm ? (
          <div className="mb-3">
            <ListForm />
          </div>
        ) : (
          <button
            onClick={handleToggleForm}
            className="w-full flex items-center gap-2"
          >
            <Plus className="size-4" />
            New List
          </button>
        )}
      </div>
    </div>
  );
}
