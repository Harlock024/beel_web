export type Subtask = {
  id: string;
  title: string;
  is_completed?: boolean;
  sub_tasks?: Subtask[];
};
