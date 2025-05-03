import { FormEvent, useEffect, useState } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/task_store";
import { ChevronDown, Scan, X } from "lucide-react";
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
import { useFiltersStore } from "@/stores/useFilterStore";

type TaskDetailsProps = {
  className?: string;
  task?: Task;
};

export function TaskDetails({ className, task }: TaskDetailsProps) {
  const { updateTask, removeTask, closeTask } = useTaskStore();
  const { lists, countedTask } = useListStore();
  const { filterTasks, filteredTasks } = useFiltersStore();
  const [currentTask, setCurrentTask] = useState<Task | undefined>(task);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  const handleEditTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;
    setIsSaving(true);

    const updatedTask: Task = {
      ...currentTask,
      title: currentTask.title.trim(),
      description: currentTask.description?.trim() || undefined,
      due_date: currentTask.due_date || undefined,
      list_id: currentTask.list_id,
    };
    updateTask(updatedTask);
    countedTask(currentTask.list_id!);

    setIsSaving(false);
  };

  const handleRemoveTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!task?.id) return;

    removeTask(task.id);

    if (task.list_id) {
      countedTask(task.list_id);
    }

    filterTasks({ listId: task.list_id || undefined });

    setCurrentTask(undefined);
  };

  const handleDateChange = (date: Date | undefined) => {
    setCurrentTask((prev) =>
      prev
        ? { ...prev, due_date: date ? date.toISOString() : undefined }
        : undefined,
    );
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newListId = e.target.value;
    setCurrentTask((prev) => {
      if (!prev) return undefined;
      if (prev.list_id) countedTask(prev.list_id);
      countedTask(newListId);
      return { ...prev, list_id: newListId };
    });
  };

  const handleNameChange = (value: string) => {
    setCurrentTask((prev) => (prev ? { ...prev, title: value } : undefined));
  };

  const handleDescriptionChange = (value: string) => {
    setCurrentTask((prev) =>
      prev ? { ...prev, description: value } : undefined,
    );
  };

  if (!currentTask) {
    return (
      <div
        className={cn(
          "flex flex-col justify-center  items-center h-full max-h-[100vh] overflow-y-auto text-muted-foreground",
          className,
        )}
      >
        <Scan size={48} className="mb-4 opacity-50" />
        <p className="text-lg">No task selected</p>
        <p className="text-sm">Select a task to view or edit details</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full border-l  flex flex-col ", className)}>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Task Name */}
        <div>
          <label
            htmlFor="task-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Name
          </label>
          <input
            id="task-name"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={currentTask.title}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter task name"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="task-description"
            className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-primary"
            value={currentTask.description || ""}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        {/* List Selection */}
        <div>
          <label
            htmlFor="task-list"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            List
          </label>
          <select
            id="task-list"
            value={currentTask.list_id || ""}
            onChange={handleListChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">None</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {currentTask.due_date ? (
                  format(new Date(currentTask.due_date), "PPP")
                ) : (
                  <span>Select a date</span>
                )}
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarDemo
                selectedDate={
                  currentTask.due_date
                    ? new Date(currentTask.due_date)
                    : undefined
                }
                onDataChange={handleDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t space-y-2">
          <Button
            onClick={handleEditTask}
            className="w-full"
            disabled={isSaving || !currentTask.title.trim()}
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
  );
}
