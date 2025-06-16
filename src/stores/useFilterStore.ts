import { Task } from "@/types/task";
import { create } from "zustand";
import { useTaskStore } from "./task_store";
import { isFuture, isToday, parseISO } from "date-fns";

export type FilterType = "today" | "upcoming" | undefined;

type FilterState = {
  filteredTasks: Task[];
  filterTasks: (filters?: { listId?: string; dateFilter?: FilterType }) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  filteredTasks: [],
  filterTasks: (filters) => {
    const { listId, dateFilter } = filters || {};
    const taskMap = useTaskStore.getState().tasks;

    const allTasks: Task[] = [];

    if (listId) {
      for (const task of taskMap.values()) {
        if (task.list_id === listId) {
          allTasks.push(task);
        }
      }
    } else {
      allTasks.push(...Array.from(taskMap.values()));
    }

    const filtered = allTasks.filter((task) => {
      if (!task.due_date) return false;

      const dueDate = parseISO(task.due_date);

      const matchesDate =
        dateFilter === "today"
          ? isToday(dueDate)
          : dateFilter === "upcoming"
            ? isFuture(dueDate) && !isToday(dueDate)
            : true;

      return matchesDate;
    });

    set({ filteredTasks: filtered });
  },
}));
