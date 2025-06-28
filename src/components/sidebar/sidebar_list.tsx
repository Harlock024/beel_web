import { useListStore } from "@/stores/list_store";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ListCard } from "../list/listCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus } from "lucide-react";
import { ListForm } from "../list/list_form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function SidebarList() {
  const { lists, fetchLists } = useListStore();
  const [isAddingList, setIsAddingList] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

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
        className="w-full"
      >
        <div className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#ececec] transition-colors cursor-pointer"> 
          <span className="text-[14px] select-none text-gray-500 font-medium">
            Lists
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-1 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleAddList();
              }}
            >
              <Plus className="w-4 h-4 text-gray-500   transition-colors" />
            </Button>

            <CollapsibleTrigger className="flex  items-center justify-center h-5 w-5 p-0">
            <Button variant={"ghost"}  size="icon" className="h-5 w-5 p-1 cursor-pointer hover:bg-gray-200 transition-colors">
              <ChevronDown 
                className={cn(
                  "w-5 h-5 text-gray-500  transition-transform duration-200",
                  !isOpen && "-rotate-90"
                )} 
              />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        
        <CollapsibleContent className="p-1">
          <ScrollArea className="h-50px pr-1">
            <div className="space-y-0.5 pt-1">
              {lists.length === 0 ? (
                <div className="text-xs text-gray-400 py-4 text-center">
                  No lists available
                </div>
              ) : (
                lists.map((list) => (
                  <ListCard key={list.id} list={list} />
                ))
              )}
            </div>
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
