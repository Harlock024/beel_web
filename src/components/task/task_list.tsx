import { useFiltersStore } from "@/stores/useFilterStore";
import { useTaskStore } from "@/stores/task_store";
import { TaskCard } from "./task_card";
import { useEffect } from "react";

export function TaskList() {
  const { tasks, getTasks } = useTaskStore();
  const { filteredTasks } = useFiltersStore();
  console.log("all tasks", tasks);

  console.log("filtered task", filteredTasks);

  useEffect(() => {
    getTasks();
  }, []);

  const showTasks = filteredTasks.length > 0 ? filteredTasks : tasks;

  console.log("show tasks", showTasks);

  return (
    <div className="space-y-2">
      {showTasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
}
