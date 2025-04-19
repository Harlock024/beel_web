import { useAuthStore } from "@/stores/useAuthStore";
import { Protected } from "./Protected";
import { TaskForm } from "./task/task_form";
import { TaskList } from "./task/task_list";
import { Wind } from "lucide-react";

export function BeelWrapper() {
  const user = useAuthStore((state) => state.user);

  return (
    <Protected>
      <TaskForm />
      <TaskList />
    </Protected>
  );
}
