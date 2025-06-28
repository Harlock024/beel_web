import { useListStore } from "@/stores/list_store";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ListCard } from "../list/listCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Collapsible,CollapsibleContent,CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus } from "lucide-react";
import { ListForm } from "../list/list_form";
import { Button } from "../ui/button";

export function SidebarList() {
  const { lists, fetchLists } = useListStore();
  const [isAddingList, setIsAddingList] = useState(false);
  const [accordionValue, setAccordionValue] = useState("lists");
  const  [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (lists.length === 0) {
      fetchLists();
    }
  }, [fetchLists]);

  const handleAddList = () => {
    setIsAddingList(true);
  };

  const handleListComplete = () => {
    setIsAddingList(false);
  };

  return (
    <aside>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full">
      <div className="flex items-center justify-between p-2">
        
      <span className="text-[14px] tracking-wider text-gray-400 font-medium">
        List
        </span>
        <div className="flex items-center ">
        <button
          className="mt-2 mb-2 w-full"
          onClick={handleAddList}
        >
          <Plus className="w-4 h-4 mr-2" />
        </button>

          <CollapsibleTrigger className="flex items-center justify-between w-4 h-4">
          <ChevronDown className={`transition-transform  ${isOpen ? "" : "-rotate-90"}`} />
        </CollapsibleTrigger>
        </div>
         </div>
        <CollapsibleContent className="p-2">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
            </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
        
  
      {isAddingList && (
        <ListForm
          onComplete={handleListComplete}
          isOpen={isAddingList}
        />
      )}
    </aside>
  );
}
