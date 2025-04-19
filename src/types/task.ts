import { Subtask } from "./subTask";
import { Tag } from "./tag";
export type Task = {
  id?: string;
  title: string;
  list_id?: string;
  sub_tasks?: Subtask[];
  tags?: Tag[];
  description?: string;
  completed: boolean;
  due_date?: string;
};
