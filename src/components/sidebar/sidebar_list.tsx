import { useListStore } from "@/stores/list_store";
import { List as ListIcon, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ListForm } from "../list/list_form";
import { Button } from "../ui/button";
import { List } from "@/types/list";
import { ScrollArea } from "../ui/scroll-area";
import { Select } from "@radix-ui/react-select";
import { ListCard } from "../list/listCard";

export function SidebarList() {
  const { lists, fetchLists } = useListStore();
  const [isToggleForm, setToggleForm] = useState(false);
  const { selectedListId, setSelectedList } = useListStore();
  const [selectedList, setSelectedListId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (lists.length === 0) {
      fetchLists();
    }
  }, []);

  const handleToggleForm = (e: FormEvent) => {
    e.preventDefault();
    setToggleForm(!isToggleForm);
  };

  return (
    <div className="h-full flex flex-col  justify-start">
      <div className="py-2 px-1">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Lists
          </h2>
          <button onClick={handleToggleForm}>
            <Plus className="text-gray-400 h-5 w-5" />
          </button>
        </div>
        <div className="space-y-1  overflow-y-auto pr-1">
          <ScrollArea className="max-h-96">
            {lists.length === 0 ? (
              <div className="text-sm text-gray-400 py-1">No hay listas</div>
            ) : (
              lists.map((list, index) => <ListCard key={index} list={list} />)
            )}
          </ScrollArea>
        </div>
      </div>
      {isToggleForm && (
        <div className="">
          <ListForm />
        </div>
      )}
    </div>
  );
}
