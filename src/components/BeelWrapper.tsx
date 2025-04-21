import { useAuthStore } from "@/stores/useAuthStore";
import { Protected } from "./Protected";
import { TaskForm } from "./task/task_form";
import { TaskList } from "./task/task_list";
import { Wind } from "lucide-react";
import { useListStore } from "@/stores/list_store";
import { useTaskStore } from "@/stores/task_store";
import { useEffect } from "react";

export function BeelWrapper() {
  const user = useAuthStore((state) => state.user);
  const { fetchLists } = useListStore();
  const { getTasks } = useTaskStore();

  useEffect(() => {
    fetchLists();
    getTasks();
  }, [fetchLists, getTasks]);

  return (
    <Protected>
      <TaskForm />
      <TaskList />
    </Protected>
  );
}
