import { create } from "zustand";
import {
  CreateTask,
  DeleteTask,
  FetchTasks,
  FetchTasksByFilter,
  UpdateTask,
} from "../services/task_services";
import { Task } from "../types/task";
import toast from "react-hot-toast";
import { array } from "astro:schema";
import { FilterType } from "./useFilterStore";

type TaskState = {
  tasks: Map<string, Task>;
  task?: Task;
  listFetched: Set<string>;
  filtersFetched: Set<String>;
  setTask: (id: string) => void;
  getTasks: (list_id?: string, filter?: FilterType) => Promise<void>;
  closeTask: () => void;
  addTask: (newTask: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (updatedTask: Partial<Task>, task_id: string) => void;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: new Map(),
  listFetched: new Set(),
  filtersFetched: new Set(),
  task: undefined,
  getTasks: async (list_id, filter) => {
    const { listFetched, tasks, filtersFetched } = get();
    const newTasks = new Map(tasks);
    if (list_id && !listFetched.has(list_id)) {
      const response = await FetchTasks({ list_id });

      if (response.tasks.length === 0) {
        set({
          tasks: new Map(),
          listFetched: new Set(listFetched).add(list_id),
        });
      }
      for (const task of response.tasks) {
        newTasks.set(task.id!, task);
      }
      set({
        tasks: newTasks,
        listFetched: new Set(listFetched).add(list_id),
      });
    }
    if (filter && !filtersFetched.has(filter)) {
      const response = await FetchTasksByFilter(filter);
      for (const task of response.tasks) {
        newTasks.set(task.id!, task);
      }
      set({
        tasks: newTasks,
        filtersFetched: new Set(filtersFetched).add(filter),
      });
    }
  },
  addTask: async (newTask: Task) => {
    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = { ...newTask, id: tempId };

    set((state) => {
      const updated = new Map(state.tasks);
      updated.set(tempId, tempTask);
      return { tasks: updated };
    });

    try {
      const created = await CreateTask(newTask);

      set((state) => {
        const updated = new Map(state.tasks);
        updated.delete(tempId);
        updated.set(created.id!, created);
        return { tasks: updated };
      });
    } catch (error) {
      set((state) => {
        const updated = new Map(state.tasks);
        updated.delete(tempId);
        return { tasks: updated };
      });

      console.error("Error al crear tarea", error);
    }
  },

  removeTask: async (id) => {
    const state = get();
    const taskToDelete = state.tasks.get(id);
    if (!taskToDelete) return;

    set((state) => {
      const deleted = new Map(state.tasks);
      deleted.delete(id);
      return { tasks: deleted };
    });

    try {
      await DeleteTask(id);
    } catch (error) {
      console.error("Error al eliminar tarea", error);
      set((state) => {
        const rollback = new Map(state.tasks);
        rollback.set(id, taskToDelete);
        return { tasks: rollback };
      });
    }
  },

  closeTask: () => {
    set(() => ({ task: undefined }));
  },

  setTask: (id) => {
    const task = get().tasks.get(id);
    if (task) set({ task });
  },

  updateTask: async (updatedTask, task_id) => {
    const state = get();
    const existingTask = state.tasks.get(task_id);

    if (!existingTask) return;

    const tasktoUpdate = { ...existingTask, ...updatedTask };

    set((state) => {
      const updated = new Map(state.tasks);
      updated.set(task_id, tasktoUpdate);
      return { tasks: updated };
    });

    try {
      await UpdateTask(updatedTask, task_id);
    } catch (error) {
      set((state) => {
        const updated = new Map(state.tasks);
        updated.set(task_id, existingTask);
        return { tasks: updated };
      });
      toast.error("No se pudo actualizar la tarea");
    }
  },
}));
