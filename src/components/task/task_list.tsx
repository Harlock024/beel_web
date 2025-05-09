import { useTaskStore } from "@/stores/task_store";
import { TaskCard } from "./task_card";
import { useListStore } from "@/stores/list_store";
import { useEffect } from "react";

export function TaskList({ list_id }: { list_id: string }) {
  const { tasks, getTasks } = useTaskStore();

  useEffect(() => {
    if (list_id) {
      getTasks(list_id);
    } else {
      console.error("No list ID provided");
    }
  }, [list_id]);

  console.log("list id  to task", list_id);

  if (!tasks) {
    return (
      <div className="text-center text-muted-foreground">Create a task</div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        {tasks ? "No tasks assigned to this list" : "No tasks created yet"}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
}
