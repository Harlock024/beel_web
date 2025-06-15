import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { ListForm } from "../list/list_form";

export function SidebarActions() {
  const [newList, setIsNewList] = useState(false);

  function HandletoggleNewList() {
    setIsNewList(!newList);
  }
  function HandlerOnClomplete() {
    setIsNewList(false);
  }

  return (
    <div>
      <section className="flex justify-between items-center p-4 border-t">
        <h2>
          <button
            onClick={() => {
              HandletoggleNewList();
            }}
            className="flex items-center cursor-pointer text-sm text-gray-700 hover:text-gray-900"
          >
            <Plus className="w-4 h-4 mr-2 inline-block" />
            New List
          </button>
        </h2>
        <div>
          <Settings2 />
        </div>
      </section>
      {newList && <ListForm isOpen={newList} onComplete={HandlerOnClomplete} />}
    </div>
  );
}
