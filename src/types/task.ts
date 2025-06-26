import { Subtask } from "./subTask";
import { Tag } from "./tag";
export type Task = {
  id?: string;
  title: string;
  list_id: string;
  sub_tasks?: Subtask[];
  tags?: Tag[];
  description?: string;
  is_completed: boolean;
  status?: string;
  due_date?: string;
};

export type TaskResponse = {
  tasks: Task[];
};
