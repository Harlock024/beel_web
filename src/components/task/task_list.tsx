import { useFiltersStore } from "@/stores/useFilterStore";
import { useTaskStore } from "@/stores/task_store";
import { TaskCard } from "./task_card";

export function TaskList() {
  const { tasks } = useTaskStore();
  const { filteredTasks, activeFilters } = useFiltersStore();

  const isFiltering = !!activeFilters.listId;

  const showTasks = isFiltering ? filteredTasks : tasks;

  if (showTasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        {isFiltering
          ? "No tasks assigned to this list"
          : "No tasks created yet"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showTasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
}
