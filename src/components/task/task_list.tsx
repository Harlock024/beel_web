import { useTaskStore } from "@/stores/task_store";
import { TaskCard } from "./task_card";
import { useEffect } from "react";
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

  useEffect(() => {
    if (list_id || filter) {
      getTasks(list_id, filter);
    }
  }, [list_id, filter]);

  useEffect(() => {
    if (filter) {
      filterTasks({ listId: list_id, dateFilter: filter });
    }
  }, [tasks, filter]);

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
