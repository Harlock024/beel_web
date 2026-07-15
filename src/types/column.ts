import { Task } from "./task";

export type Column = {
  id?: string;
  title: string;
  position: number;
  board_id: string;
  tasks?: Task[];
};
