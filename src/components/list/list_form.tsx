import { type FormEvent, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListStore } from "@/stores/list_store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ListForm({
  list_id,
  onComplete,
}: {
  list_id?: string;
  onComplete?: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState("#aabbcc");
  const { createList } = useListStore();

  function handleCreateList(e: FormEvent) {
    e.preventDefault();

    if (onComplete) {
      onComplete();
    }
    createList(nameRef.current?.value || "", color);
  }

  return (
    <form
      onSubmit={handleCreateList}
      className="flex justify-start items-center bg-white gap-2"
    >
      <div className="flex items-center justify-center bg-gray-50 rounded-md p-1.5">
        <Plus className="text-gray-500 h-4 w-4" />
      </div>

      <input
        className="border-none text-sm placeholder:text-gray-400 text-gray-700 ring-0 focus:ring-0 focus:outline-none flex-1 bg-transparent"
        type="text"
        placeholder="Nueva lista"
        ref={nameRef}
        autoComplete="off"
      />
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn("w-5 h-5  rounded-md")}
              style={{
                backgroundColor: color,
              }}
              aria-label="Elegir color"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-gray-200">
            <HexColorPicker color={color} onChange={setColor} />
            <div className="text-xs text-center text-gray-500 font-medium pt-1">
              {color.toUpperCase()}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </form>
  );
}
