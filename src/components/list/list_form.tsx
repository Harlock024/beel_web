import { type FormEvent, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ListForm({ onComplete }: { onComplete?: () => void }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState("#aabbcc");

  function handleCreateList(e: FormEvent) {
    e.preventDefault();
    if (onComplete) {
      onComplete();
    }
  }

  return (
    <form
      onSubmit={handleCreateList}
      className="flex  justify-start items-center bg-white"
    >
      <div className="flex items-center justify-center bg-gray-50 rounded-md p-1.5 mr-2">
        <Plus className="text-gray-500 h-4 w-4" />
      </div>
      <input
        className="border-none text-sm placeholder:text-gray-400 text-gray-700 ring-0 focus:ring-0 focus:outline-none flex-1 bg-transparent"
        type="text"
        placeholder="Nueva lista"
        ref={nameRef}
        autoComplete="off"
      />
      <div className=" flex-col items-center justify-center w-full h-full">
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "size-5 rounded-md transition-all duration-200 cursor-pointer",
              )}
              style={{
                backgroundColor: color,
              }}
              aria-label="Elegir color"
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
    </form>
  );
}
