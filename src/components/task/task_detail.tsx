import { useTaskStore } from "@/stores/task_store";

export function TaskDetail() {
  const { task } = useTaskStore();
  return <aside>{task?.id}</aside>;
}
