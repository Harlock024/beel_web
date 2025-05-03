import { Task } from "@/types/task";
import { create } from "zustand";
import { useTaskStore } from "./task_store";
import { isToday, isFuture, parseISO } from "date-fns";

export type FilterType = "all" | "today" | "upcoming" | undefined;

type FilterStore = {
  filteredTasks: Task[];
  filterTasks: (filters?: { listId?: string; dateFilter?: FilterType }) => void;
};

export const useFiltersStore = create<FilterStore>((set) => ({
  filteredTasks: [],
  filterTasks: (filters) => {
    const tasks = useTaskStore.getState().tasks;
    const { listId, dateFilter } = filters || {};

    const filtered = tasks.filter((task) => {
      const belongsToList = listId ? task.list_id === listId : true;

      if (dateFilter) {
        if (!task.due_date) return false;

        const dueDate = parseISO(task.due_date);
        const matchesDate =
          dateFilter === "today"
            ? isToday(dueDate)
            : dateFilter === "upcoming"
              ? isFuture(dueDate) && !isToday(dueDate)
              : true;

        return belongsToList && matchesDate;
      }

      return belongsToList;
    });

    set({ filteredTasks: filtered });
  },
}));
