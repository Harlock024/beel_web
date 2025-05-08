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
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Editar Lista</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <input
          ref={nameRef}
          type="text"
          placeholder="Nombre de la lista"
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
            <PopoverContent className="w-auto p-3 border-gray-200">
              <div className="space-y-3">
                <HexColorPicker color={color} onChange={setColor} />
                <div className="text-xs text-center text-gray-500 font-medium pt-1">
                  {color.toUpperCase()}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
