import { FormEvent, useEffect, useState } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/task_store";
import { FilterType } from "@/stores/useFilterStore";
import { format, addDays } from "date-fns";

import { Plus } from "lucide-react";
import { useListStore } from "@/stores/list_store";
import toast from "react-hot-toast";

export function TaskForm({
  filter,
  list_id,
}: {
  filter?: FilterType;
  list_id?: string;
}) {
  const { addTask } = useTaskStore();
  const { selectedListId, clearSelectedList } = useListStore();
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    if (filter && !list_id) {
      clearSelectedList();
    }
  }, [filter, list_id, clearSelectedList]);

  function getDueDate(): string | undefined {
    if (filter === "today") {
      return format(new Date(), "yyyy-MM-dd");
    }
    if (filter === "upcoming") {
      return format(addDays(new Date(), 1), "yyyy-MM-dd");
    }
    return undefined;
  }

  function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (taskName !== null) {
      const newTask: Task = {
        title: taskName,
        list_id: list_id ?? selectedListId ?? undefined,
        due_date: getDueDate(),
        is_completed: false,
      };
      addTask(newTask);
      setTaskName("");
      toast.success("Task added successfully!");
      return;
    }
    toast.error("Task name cannot be empty!");
  }
  return (
    <div className="w-full">
      <form onSubmit={handleAddTask} className="flex flex-col gap-4 ">
        <div className="justify-start shadow-inner rounded-md px-4 py-2 items-center flex space-x-2">
          <Plus className="text-muted-foreground h-5 w-5" />
          <input
            className="border-none w-full ring-0 focus:ring-0 focus:outline-none"
            type="text"
            id="name"
            required
            placeholder="Add New Task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <button className="hidden" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
}
