import { useListStore } from "@/stores/list_store";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ListCard } from "../list/listCard";

export function SidebarList() {
  const { lists, fetchLists } = useListStore();

  useEffect(() => {
    if (lists.length === 0) {
      fetchLists();
    }
  }, [fetchLists]);

  return (
    <aside>
      <header className="">
        <h2 className="text-xs  tracking-wider text-gray-600 font-semibold">
          Lists
        </h2>
      </header>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ScrollArea className="h-full px-4 py-2">
          {lists.length === 0 ? (
            <div className="text-sm text-gray-400 py-4 text-center">
              No hay listas disponibles
            </div>
          ) : (
            <ul className="space-y-2">
              {lists.map((list) => (
                <li key={list.id}>
                  <ListCard list={list} />
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
    </aside>
  );
}
