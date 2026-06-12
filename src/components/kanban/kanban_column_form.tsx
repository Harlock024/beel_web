import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useKanbanStore } from "@/stores/kanban_store";
import { cn } from "@/lib/utils";

export function KanbanColumnForm() {
  const { createColumn } = useKanbanStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) {
      createColumn(trimmed);
      setTitle("");
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setTitle("");
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground min-w-[280px] shrink-0"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">Add column</span>
      </button>
    );
  }

  return (
    <div className="min-w-[280px] shrink-0 bg-muted/30 rounded-lg p-3">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSubmit}
        placeholder="Column title..."
        className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground px-1"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Add
        </button>
        <button
          onClick={() => {
            setTitle("");
            setIsEditing(false);
          }}
          className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
