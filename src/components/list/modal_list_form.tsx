import { useListStore } from "@/stores/list_store";
import { List } from "@/types/list";
import { Task } from "@/types/task";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import { X } from "lucide-react";

export function ModalEditTaskForm({
  list,
  onClose,
}: {
  list: List;
  onClose: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState(list.color || "#aabbcc");
  const { updateList } = useListStore();

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.value = list.title;
    }
  }, [list.title]);

  function handleUpdateList(e: FormEvent) {
    e.preventDefault();
    const title = nameRef.current?.value?.trim();
    if (!title) return;

    updateList({ id: list.id, title, color });
    onClose();
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleUpdateList}
        className="bg-card rounded-lg p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit List</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <input
          ref={nameRef}
          type="text"
          placeholder="List name"
          className="w-full border p-2 rounded mb-4"
        />
        <div className="mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn("size-6 rounded-md border cursor-pointer")}
                style={{ backgroundColor: color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 border-border">
              <div className="space-y-3">
                <HexColorPicker color={color} onChange={setColor} />
                <div className="text-xs text-center text-muted-foreground font-medium pt-1">
                  {color.toUpperCase()}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
