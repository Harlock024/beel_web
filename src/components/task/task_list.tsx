import { useTaskStore } from "@/stores/task_store";
import { TaskCard } from "./task_card";
import { useEffect, useState } from "react";
import { FilterType, useFilterStore } from "@/stores/useFilterStore";

export function TaskList({
  list_id,
  filter,
}: {
  list_id?: string;
  filter?: FilterType;
}) {
  const { tasks, getTasks } = useTaskStore();
  const { filteredTasks, filterTasks } = useFilterStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (list_id || filter) {
      getTasks(list_id, filter);
      setIsLoading(false);
    }
  }, [list_id, filter]);

  useEffect(() => {
    if (filter) {
      filterTasks({ listId: list_id, dateFilter: filter });
      setIsLoading(false);
    }
  }, [tasks, filter]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="bg-card rounded-lg p-4 flex flex-col gap-2 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-muted rounded w-2/3 mb-1"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-16 bg-muted rounded"></div>
            <div className="h-6 w-10 bg-muted rounded"></div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 flex flex-col gap-2 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-muted rounded w-2/3 mb-1"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-16 bg-muted rounded"></div>
            <div className="h-6 w-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (filter) {
    if (filteredTasks.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          No tasks match the filter
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {filteredTasks.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))}
      </div>
    );
  }

  if (list_id) {
    const taskList = Array.from(tasks.values()).filter(
      (task) => task.list_id === list_id,
    );

    if (taskList.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          No tasks in this list
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {taskList.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))}
      </div>
    );
  }
  return null;
}
