import { create } from "zustand";
import {
  CreateTask,
  DeleteTask,
  FetchTasks,
  FetchTasksByFilter,
  UpdateTask,
} from "../services/task_services";
import {
  CreateSubtask,
  DeleteSubtask,
  UpdateSubtask,
} from "../services/subtask_services";
import { AddTag, RemoveTag } from "../services/tag_services";
import { Task } from "../types/task";
import { Subtask } from "../types/subTask";
import { Tag } from "../types/tag";
import toast from "react-hot-toast";
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
  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  removeSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addTag: (taskId: string, name: string) => Promise<void>;
  removeTag: (taskId: string, tagId: string) => Promise<void>;
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
      console.error("Error al actualizar tarea", error);
    }
  },

  addSubtask: async (taskId, title) => {
    const tempId = `temp-${Date.now()}`;
    const tempSubtask: Subtask = { id: tempId, title, done: false };

    set((state) => {
      const task = state.tasks.get(taskId);
      if (!task) return state;
      const updated = new Map(state.tasks);
      updated.set(taskId, {
        ...task,
        sub_tasks: [...(task.sub_tasks || []), tempSubtask],
      });
      const currentTask =
        state.task?.id === taskId
          ? { ...state.task, sub_tasks: [...(state.task.sub_tasks || []), tempSubtask] }
          : state.task;
      return { tasks: updated, task: currentTask };
    });

    try {
      const created = await CreateSubtask(taskId, title);
      set((state) => {
        const task = state.tasks.get(taskId);
        if (!task) return state;
        const updated = new Map(state.tasks);
        updated.set(taskId, {
          ...task,
          sub_tasks: (task.sub_tasks || []).map((s) =>
            s.id === tempId ? created : s,
          ),
        });
        const currentTask =
          state.task?.id === taskId
            ? {
                ...state.task,
                sub_tasks: (state.task.sub_tasks || []).map((s) =>
                  s.id === tempId ? created : s,
                ),
              }
            : state.task;
        return { tasks: updated, task: currentTask };
      });
    } catch (error) {
      set((state) => {
        const task = state.tasks.get(taskId);
        if (!task) return state;
        const updated = new Map(state.tasks);
        updated.set(taskId, {
          ...task,
          sub_tasks: (task.sub_tasks || []).filter((s) => s.id !== tempId),
        });
        const currentTask =
          state.task?.id === taskId
            ? {
                ...state.task,
                sub_tasks: (state.task.sub_tasks || []).filter(
                  (s) => s.id !== tempId,
                ),
              }
            : state.task;
        return { tasks: updated, task: currentTask };
      });
      console.error("Error al crear subtask", error);
    }
  },

  toggleSubtask: async (taskId, subtaskId) => {
    const state = get();
    const task = state.tasks.get(taskId);
    if (!task) return;
    const subtask = (task.sub_tasks || []).find((s) => s.id === subtaskId);
    if (!subtask) return;

    const toggled = { ...subtask, done: !subtask.done };

    set((s) => {
      const updated = new Map(s.tasks);
      updated.set(taskId, {
        ...task,
        sub_tasks: (task.sub_tasks || []).map((st) =>
          st.id === subtaskId ? toggled : st,
        ),
      });
      const currentTask =
        s.task?.id === taskId
          ? {
              ...s.task,
              sub_tasks: (s.task.sub_tasks || []).map((st) =>
                st.id === subtaskId ? toggled : st,
              ),
            }
          : s.task;
      return { tasks: updated, task: currentTask };
    });

    try {
      await UpdateSubtask(taskId, subtaskId, { done: toggled.done });
    } catch (error) {
      set((s) => {
        const updated = new Map(s.tasks);
        updated.set(taskId, {
          ...task,
          sub_tasks: (task.sub_tasks || []).map((st) =>
            st.id === subtaskId ? subtask : st,
          ),
        });
        const currentTask =
          s.task?.id === taskId
            ? {
                ...s.task,
                sub_tasks: (s.task.sub_tasks || []).map((st) =>
                  st.id === subtaskId ? subtask : st,
                ),
              }
            : s.task;
        return { tasks: updated, task: currentTask };
      });
      console.error("Error al actualizar subtask", error);
    }
  },

  removeSubtask: async (taskId, subtaskId) => {
    const state = get();
    const task = state.tasks.get(taskId);
    if (!task) return;
    const subtask = (task.sub_tasks || []).find((s) => s.id === subtaskId);
    if (!subtask) return;

    set((s) => {
      const updated = new Map(s.tasks);
      updated.set(taskId, {
        ...task,
        sub_tasks: (task.sub_tasks || []).filter((st) => st.id !== subtaskId),
      });
      const currentTask =
        s.task?.id === taskId
          ? {
              ...s.task,
              sub_tasks: (s.task.sub_tasks || []).filter(
                (st) => st.id !== subtaskId,
              ),
            }
          : s.task;
      return { tasks: updated, task: currentTask };
    });

    try {
      await DeleteSubtask(taskId, subtaskId);
    } catch (error) {
      set((s) => {
        const updated = new Map(s.tasks);
        updated.set(taskId, {
          ...task,
          sub_tasks: [...(task.sub_tasks || []), subtask],
        });
        const currentTask =
          s.task?.id === taskId
            ? {
                ...s.task,
                sub_tasks: [...(s.task.sub_tasks || []), subtask],
              }
            : s.task;
        return { tasks: updated, task: currentTask };
      });
      console.error("Error al eliminar subtask", error);
    }
  },

  addTag: async (taskId, name) => {
    const tempId = `temp-${Date.now()}`;
    const tempTag: Tag = { id: tempId, name };

    set((s) => {
      const task = s.tasks.get(taskId);
      if (!task) return s;
      const updated = new Map(s.tasks);
      updated.set(taskId, {
        ...task,
        tags: [...(task.tags || []), tempTag],
      });
      const currentTask =
        s.task?.id === taskId
          ? { ...s.task, tags: [...(s.task.tags || []), tempTag] }
          : s.task;
      return { tasks: updated, task: currentTask };
    });

    try {
      const created = await AddTag(taskId, name);
      set((s) => {
        const task = s.tasks.get(taskId);
        if (!task) return s;
        const updated = new Map(s.tasks);
        updated.set(taskId, {
          ...task,
          tags: (task.tags || []).map((t) => (t.id === tempId ? created : t)),
        });
        const currentTask =
          s.task?.id === taskId
            ? {
                ...s.task,
                tags: (s.task.tags || []).map((t) =>
                  t.id === tempId ? created : t,
                ),
              }
            : s.task;
        return { tasks: updated, task: currentTask };
      });
    } catch (error) {
      set((s) => {
        const task = s.tasks.get(taskId);
        if (!task) return s;
        const updated = new Map(s.tasks);
        updated.set(taskId, {
          ...task,
          tags: (task.tags || []).filter((t) => t.id !== tempId),
        });
        const currentTask =
          s.task?.id === taskId
            ? {
                ...s.task,
                tags: (s.task.tags || []).filter((t) => t.id !== tempId),
              }
            : s.task;
        return { tasks: updated, task: currentTask };
      });
      console.error("Error al agregar tag", error);
    }
  },

  removeTag: async (taskId, tagId) => {
    const state = get();
    const task = state.tasks.get(taskId);
    if (!task) return;
    const tag = (task.tags || []).find((t) => t.id === tagId);
    if (!tag) return;

    set((s) => {
      const updated = new Map(s.tasks);
      updated.set(taskId, {
        ...task,
        tags: (task.tags || []).filter((t) => t.id !== tagId),
      });
      const currentTask =
        s.task?.id === taskId
          ? {
              ...s.task,
              tags: (s.task.tags || []).filter((t) => t.id !== tagId),
            }
          : s.task;
      return { tasks: updated, task: currentTask };
    });

    try {
      await RemoveTag(taskId, tagId);
    } catch (error) {
      set((s) => {
        const updated = new Map(s.tasks);
        updated.set(taskId, {
          ...task,
          tags: [...(task.tags || []), tag],
        });
        const currentTask =
          s.task?.id === taskId
            ? { ...s.task, tags: [...(s.task.tags || []), tag] }
            : s.task;
        return { tasks: updated, task: currentTask };
      });
      console.error("Error al eliminar tag", error);
    }
  },
}));
