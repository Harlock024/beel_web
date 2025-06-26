import { useEffect, useState, useRef } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/task_store";
import { Expand, X } from "lucide-react";
import { Button } from "../ui/button";
import { format, set } from "date-fns";
import { CalendarDemo } from "../calendar/CalentadarDemo";
import { useListStore } from "@/stores/list_store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { List } from "@/types/list";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TaskDetailsProps = {
  className?: string;
};

export function TaskDetails({ className }: TaskDetailsProps) {
  const { updateTask, removeTask, closeTask, task } = useTaskStore();
  const { lists } = useListStore();
  const { setIsOpen: setSidebarOpen } = useSidebarStore();
  const [currentTask, setCurrentTask] = useState<Task | undefined>(task);
  const [isOverlay, setIsOverlay] = useState(false); 
  const [isSaving, setIsSaving] = useState(false); 
  const sidebarRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(400);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  console.log("currentTask", currentTask);

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
        window.innerWidth * 0.8, 
      );

      sidebarRef.current.style.width = `${newWidth}px`;
      widthRef.current = newWidth;

      if (newWidth > window.innerWidth / 2) {
        setIsOverlay(true); 
        setSidebarOpen(false); 
      } else {
        setIsOverlay(false); 
        setSidebarOpen(true);
      }
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

    useEffect(() => {
      const handleKeyboardSave = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          if (!isSaving && hasTaskChanged()) {
            handleEditTask();
           
          }
        }
      };
      window.addEventListener("keydown", handleKeyboardSave);
      return () => {
        window.removeEventListener("keydown", handleKeyboardSave);
      };
    }, [currentTask, task, isSaving]);


  const handleEditTask = async () => {
    if (!currentTask || isSaving) return; 
    setIsSaving(true); 
    const toastId = toast.loading("Saving changes...");
    try {
      const changes: Partial<Task> = {};
      const trimmedTitle = currentTask.title.trim();
      const trimmedDescription = currentTask.description?.trim() || undefined;

      if (trimmedTitle !== task?.title) {
        if (!trimmedTitle) {
          toast.error("Title cannot be empty");
          toast.dismiss(toastId);
          setIsSaving(false); 
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
        toast.dismiss(toastId);
        setIsSaving(false);
        return;
      }
      updateTask(changes, currentTask.id || "");
      toast.success("Saved changes", { id: toastId });
    } catch (error) {
      toast.error("Error saving changes", { id: toastId });
    }
    finally {
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
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebarRef.current) return;

      const target = event.target as HTMLElement;

      const isClickInsideSidebar = sidebarRef.current.contains(target);
      
      const isSelectContent = !!target.closest(['[data-radix-select-content]',"[data-radix-select-trigger-content",["data-radix-select-value"]].join(', '));
      const isPopoverContent = !!target.closest('[data-radix-popper-content-wrapper]');
      const isAnyRadixPortal = !!target.closest('[data-radix-portal]');
      
      if (isClickInsideSidebar || isSelectContent || isPopoverContent || isAnyRadixPortal) {
        return;
      }
      
      closeTask();
    };

    if (task) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [task, closeTask]);

  function hasTaskChanged() {
    if (!currentTask || !task) return false;
    if (currentTask.id !== task.id) return true;


    return (
      currentTask.title.trim() !== task.title.trim() ||
     currentTask.description?.trim() !== task.description?.trim() || 
      (currentTask.due_date || "") !== (task.due_date || "") ||
      (currentTask.list_id || "") !== (task.list_id || "")
    );
  }
  return (
    <div>
      {task && (
        <div
          ref={sidebarRef}
          className={cn(
            "top-0 h-screen z-50 bg-white shadow-lg border-l transition-transform duration-300",
            isOverlay ? "fixed right-0" : "absolute right-0", 
            className,
          )}
          style={{ width: `${widthRef.current}px` }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary/30 z-10"
            onMouseDown={startResizing}
          ></div>
          <div className="flex flex-col h-full">
            {/* Header */}
            <TaskDetailsHeader
              task={currentTask}
              onClose={closeTask}
              onUpdateTitle={(title) =>
                setCurrentTask((prev) => (prev ? { ...prev, title } : undefined))
              }
            />

            
            <TaskDetailsActions
              currentTask={currentTask}
              lists={lists}
              handleListChange={handleListChange}
              handleDateChange={handleDateChange}
            />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTask();
              }}
              className="flex-1 overflow-y-auto px-6 py-4"
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskDetailsHeader({
  task,
  onUpdateTitle,
  onClose,
  onExpand,
}: {
  task: Task | undefined;
  onUpdateTitle: (title: string) => void;
  onClose: () => void;
  onExpand?: () => void;
}) {
  return (
    <div className="px-6 py-4">
      <div className="flex  items-center  mb-4">
        <div className="flex  w-full items-star justify-between  gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onExpand}>
            <Expand className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <input
        type="text"
        value={task?.title || ""}
        onChange={(e) => onUpdateTitle(e.target.value)}
        placeholder="Task name"
        className="text-2xl font-semibold w-full bg-transparent outline-none border-none 
                   focus:ring-0 border-b border-transparent focus:border-primary transition-all"
      />
    </div>
  );
}
function TaskDetailsActions({
  currentTask,
  lists,
  handleListChange,
  handleDateChange,
}: {
  currentTask: Task | undefined;
  lists: List[]
  handleListChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDateChange: (date: Date | undefined) => void;
}) {
  return (
    <div className="px-6 py-4 space-y-6 border-b">
      <div className="flex justify-start gap-2 items-center space-y-2">
        <label className="block text-sm  font-medium mb-1">List</label>
      
        <div className="w-full" >
        <Select   value={currentTask?.list_id || ""} onValueChange={(value) => {
          handleListChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>);
        }}>
          <SelectTrigger  className="w-full">
            <SelectValue placeholder="Select a list"/>
          </SelectTrigger>
          <SelectContent>
            {lists.map((list) => (
              <SelectItem
                key={list.id}
                value={list.id!}
                className="cursor-pointer hover:bg-gray-100"
              >
               {list.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
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
    </div>
  );
}
