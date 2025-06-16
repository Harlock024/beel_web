import { useEffect, useState, useRef } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/task_store";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarDemo } from "../calendar/CalentadarDemo";
import { useListStore } from "@/stores/list_store";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type TaskDetailsProps = {
  className?: string;
};

export function TaskDetails({ className }: TaskDetailsProps) {
  const { updateTask, removeTask, closeTask, task } = useTaskStore();
  const { lists } = useListStore();
  const [currentTask, setCurrentTask] = useState<Task | undefined>(task);
  const [isSaving, setIsSaving] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(400);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = sidebarRef.current?.offsetWidth || 400;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const resize = (e: MouseEvent) => {
      if (!sidebarRef.current) return;

      const newWidth = Math.min(
        Math.max(startWidth + (startX - e.clientX), 300),
        800,
      );

      sidebarRef.current.style.width = `${newWidth}px`;
      widthRef.current = newWidth;
    };

    const stopResizing = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  useEffect(() => {
    setCurrentTask(task);

    if (task && sidebarRef.current) {
      sidebarRef.current.style.width = `${widthRef.current}px`;
    }
  }, [task]);

  const handleEditTask = async () => {
    if (!currentTask) return;

    setIsSaving(true);

    try {
      const changes: Partial<Task> = {};
      const trimmedTitle = currentTask.title.trim();
      const trimmedDescription = currentTask.description?.trim() || undefined;

      if (trimmedTitle !== task?.title) {
        if (!trimmedTitle) {
          toast.error("Title cannot be empty");
          return;
        }
        changes.title = trimmedTitle;
      }

      if (trimmedDescription !== task?.description) {
        changes.description = trimmedDescription;
      }

      const dueDate = currentTask.due_date || undefined;
      if (dueDate !== task?.due_date) {
        changes.due_date = dueDate;
      }

      if (currentTask.list_id !== task?.list_id) {
        changes.list_id = currentTask.list_id;
      }

      if (Object.keys(changes).length === 0) {
        return;
      }
      updateTask(changes, currentTask.id || "");
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTask = async () => {
    if (!task?.id) return;

    removeTask(task.id);
    if (task.list_id) toast.success("Task removed successfully");
    closeTask();
  };

  const handleDateChange = (date: Date | undefined) => {
    setCurrentTask((prev) =>
      prev ? { ...prev, due_date: date?.toISOString() } : undefined,
    );
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newListId = e.target.value;
    setCurrentTask((prev) => {
      if (!prev) return undefined;
      return { ...prev, list_id: newListId };
    });
  };
  useEffect(() => {
    const handleKeyboardSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!isSaving && currentTask?.title.trim()) {
          handleEditTask();
        }
      }
    };
    window.addEventListener("keydown", handleKeyboardSave);
    return () => {
      window.removeEventListener("keydown", handleKeyboardSave);
    };
  }, [currentTask, isSaving]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebarRef.current) return;

      const target = event.target as HTMLElement;

      const isClickInsideSidebar = sidebarRef.current.contains(target);
      const isRadixPortal = target.closest(
        "[data-radix-popper-content-wrapper]",
      );

      if (!isClickInsideSidebar && !isRadixPortal) {
        closeTask();
      }
    };

    if (task) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [task]);

  return (
    <div>
      {task && (
        <div
          ref={sidebarRef}
          className={cn(
            "fixed right-0 top-0 h-screen z-50 bg-white dark:bg-zinc-900 shadow-lg border-l transition-transform duration-300",
            task ? "translate-x-0" : "translate-x-full",
            className,
          )}
          style={{ width: `${widthRef.current}px` }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary/30 z-10"
            onMouseDown={startResizing}
          ></div>
          <div className="flex flex-col h-full pl-1">
            <div className="flex justify-between items-center p-4 border-b">
              <input
                type="text"
                value={currentTask?.title || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, title: e.target.value } : undefined,
                  )
                }
                placeholder="Task name"
                className="text-lg font-semibold w-full bg-transparent outline-none border-none focus:ring-0 border-b border-transparent focus:border-primary transition-all"
              />
              <Button variant="ghost" size="icon" onClick={closeTask}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTask();
              }}
              className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
            >
              <textarea
                className="w-full bg-transparent outline-none resize-none min-h-[200px] text-sm placeholder:text-muted-foreground border-muted-foreground focus:border-primary transition-all"
                value={currentTask?.description || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, description: e.target.value } : undefined,
                  )
                }
                placeholder="Write something about this task..."
              />
              <div>
                <label className="block text-sm font-medium mb-1">List</label>
                <select
                  value={currentTask?.list_id || ""}
                  onChange={handleListChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {currentTask?.due_date ? (
                        format(new Date(currentTask.due_date), "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarDemo
                      selectedDate={
                        currentTask?.due_date
                          ? new Date(currentTask.due_date)
                          : undefined
                      }
                      onDataChange={handleDateChange}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </form>
            <div className="p-4 border-t space-y-2">
              <Button
                onClick={handleEditTask}
                className="w-full"
                disabled={isSaving || !currentTask?.title.trim()}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleRemoveTask}
                variant="destructive"
                className="w-full"
              >
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
