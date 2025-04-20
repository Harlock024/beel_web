import { FormEvent, useState } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/task_store";

import { Plus } from "lucide-react";
import { useListStore } from "@/stores/list_store";
import { FilterType } from "@/stores/useFilterStore";

export function TaskForm() {
  const { addTask } = useTaskStore();
  const { selectedListId } = useListStore();
  const [taskName, setTaskName] = useState("");

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (taskName !== null) {
      const newTask: Task = {
        title: taskName,
        list_id: selectedListId,
        completed: false,
      };
      addTask(newTask);
      setTaskName("");
    }
  }
  return (
    <div className="w-full">
      <form onSubmit={handleAddTask} className="flex flex-col gap-4 ">
        <div className="justify-start shadow-inner rounded-md px-4 py-2 items-center flex space-x-2">
          <Plus className="text-gray-400 h-5 w-5" />
          <input
            className="border-none w-full ring-0 focus:ring-0 focus:outline-none"
            type="text"
            id="name"
            placeholder="Add New Task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <button className="" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
}
