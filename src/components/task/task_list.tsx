import { useFiltersStore } from "@/stores/useFilterStore";
import { useTaskStore } from "@/stores/task_store";
import { TaskCard } from "./task_card";

export function TaskList() {
  const { tasks } = useTaskStore();
  const { filteredTasks } = useFiltersStore();
  console.log("filtered task", filteredTasks);

  const showTasks = filteredTasks.length > 0 ? filteredTasks : tasks;

  return (
    <div className="space-y-2">
      {showTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
