import { useFiltersStore } from "@/stores/useFilterStore";
import { useTaskStore } from "@/stores/task_store";
import { TaskCard } from "./task_card";
import { useEffect } from "react";

export function TaskList() {
  const { tasks, getTasks } = useTaskStore();
  const { filteredTasks } = useFiltersStore();

  const showTasks = filteredTasks.length > 0 ? filteredTasks : tasks;

  if (!showTasks) {
    return <div>No tasks found</div>;
  }
  if (filteredTasks.length === 0) {
    return <div>No tasks found</div>;
  }

  return (
    <div className="space-y-2">
      {showTasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
}
