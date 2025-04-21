import { Task } from "./task";

export interface List {
  id: string;
  title: string;
  color?: string;
}

export type ListsResponseProp = {
  lists: List[];
};
