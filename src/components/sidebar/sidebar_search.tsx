import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTaskStore } from "@/stores/task_store";
import { cn } from "@/lib/utils";
import { TaskCard } from "../task/task_card";
import { ScrollArea } from "../ui/scroll-area";

export function SidebarSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { tasks } = useTaskStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? Array.from(tasks.values()).filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-[14px] text-muted-foreground hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4 flex-shrink-0" />
        <span className="select-none">Search tasks...</span>
        <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded border text-muted-foreground">
          Ctrl+K
        </kbd>
      </button>
    );
  }

  return (
    <div className="px-1 w-full min-w-0 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent/50 border border-border">
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={() => {
            setIsOpen(false);
            setQuery("");
          }}
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {query.trim() && (
        <div className="mt-2 overflow-hidden">
          <p className="px-3 py-1 text-xs text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.length > 0 ? (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-0.5">
                {results.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="px-3 py-4 text-sm text-muted-foreground text-center">
              No tasks found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
