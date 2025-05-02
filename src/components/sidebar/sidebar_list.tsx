import { useListStore } from "@/stores/list_store";
import { List as ListIcon, Plus } from "lucide-react";
import { useFiltersStore } from "@/stores/useFilterStore";
import { FormEvent, useEffect, useState } from "react";
import { ListForm } from "../list/list_form";
import { Button } from "../ui/button";
import { List } from "@/types/list";

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
      className={`w-full flex items-center gap-2 text-sm px-2 py-1 rounded transition-colors
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

  console.log("lists", lists);

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
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Listas
        </h2>
        <button
          onClick={handleToggleForm}
          className="text-gray-400 hover:text-gray-600"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {isToggleForm && (
        <div className="mb-3">
          <ListForm />
        </div>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
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
      </div>
      {/*
      <div className="mt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={handleToggleForm}
          className="w-full flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Plus className="size-3" /> Nueva Lista
        </Button>
      </div> */}
    </div>
  );
}
