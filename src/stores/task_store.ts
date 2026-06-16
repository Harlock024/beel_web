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
} from "../services/subtask_services";
import { Task } from "../types/task";
import { Subtask } from "../types/subTask";
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
};

function findSubtask(state: TaskState, subtaskId: string): Subtask | undefined {
  for (const task of state.tasks.values()) {
    const found = findInList(task.sub_tasks || [], subtaskId);
    if (found) return found;
  }
  if (state.task) {
    return findInList(state.task.sub_tasks || [], subtaskId);
  }
  return undefined;
}

function findInList(list: Subtask[], id: string): Subtask | undefined {
  for (const s of list) {
    if (s.id === id) return s;
    const found = findInList(s.sub_tasks || [], id);
    if (found) return found;
  }
  return undefined;
}

function addSubtaskToList(
  list: Subtask[],
  parentId: string,
  subtask: Subtask,
): Subtask[] {
  return list.map((s) => {
    if (s.id === parentId) return { ...s, sub_tasks: [...(s.sub_tasks || []), subtask] };
    return { ...s, sub_tasks: addSubtaskToList(s.sub_tasks || [], parentId, subtask) };
  });
}

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

  addSubtask: async (parentId, title) => {
    const tempId = `temp-${Date.now()}`;
    const tempSubtask: Subtask = { id: tempId, title };

    function addToList(list: Subtask[] | undefined, temp: Subtask): Subtask[] {
      return [...(list || []), temp];
    }

    function replaceInList(list: Subtask[] | undefined, tempId: string, real: Subtask): Subtask[] {
      if (!list) return [];
      return list.map((s) => {
        if (s.id === tempId) return real;
        return { ...s, sub_tasks: replaceInList(s.sub_tasks, tempId, real) };
      });
    }

    function removeFromList(list: Subtask[], tempId: string): Subtask[] {
      return list
        .filter((s) => s.id !== tempId)
        .map((s) => ({ ...s, sub_tasks: removeFromList(s.sub_tasks || [], tempId) }));
    }

    set((state) => {
      const task = state.tasks.get(parentId);
      if (task) {
        const updated = new Map(state.tasks);
        updated.set(parentId, {
          ...task,
          sub_tasks: addToList(task.sub_tasks, tempSubtask),
        });
        const currentTask =
          state.task?.id === parentId
            ? { ...state.task, sub_tasks: addToList(state.task.sub_tasks, tempSubtask) }
            : state.task;
        return { tasks: updated, task: currentTask };
      }

      const updated = new Map(state.tasks);
      for (const [taskId, task] of updated) {
        const newSubs = replaceInList(task.sub_tasks || [], parentId, tempSubtask);
        if (newSubs !== task.sub_tasks) {
          updated.set(taskId, { ...task, sub_tasks: newSubs });
        }
      }
      const currentTask = state.task
        ? { ...state.task, sub_tasks: replaceInList(state.task.sub_tasks || [], parentId, tempSubtask) }
        : state.task;
      return { tasks: updated, task: currentTask };
    });

    try {
      const created = await CreateSubtask(parentId, title);
      set((state) => {
        const task = state.tasks.get(parentId);
        if (task) {
          const updated = new Map(state.tasks);
          updated.set(parentId, {
            ...task,
            sub_tasks: replaceInList(task.sub_tasks || [], tempId, created),
          });
          const currentTask =
            state.task?.id === parentId
              ? { ...state.task, sub_tasks: replaceInList(state.task.sub_tasks || [], tempId, created) }
              : state.task;
          return { tasks: updated, task: currentTask };
        }

        const updated = new Map(state.tasks);
        for (const [taskId, task] of updated) {
          const newSubs = replaceInList(task.sub_tasks || [], tempId, created);
          if (newSubs !== task.sub_tasks) {
            updated.set(taskId, { ...task, sub_tasks: newSubs });
          }
        }
        const currentTask = state.task
          ? { ...state.task, sub_tasks: replaceInList(state.task.sub_tasks || [], tempId, created) }
          : state.task;
        return { tasks: updated, task: currentTask };
      });
    } catch (error) {
      set((state) => {
        const task = state.tasks.get(parentId);
        if (task) {
          const updated = new Map(state.tasks);
          updated.set(parentId, {
            ...task,
            sub_tasks: removeFromList(task.sub_tasks || [], tempId),
          });
          const currentTask =
            state.task?.id === parentId
              ? { ...state.task, sub_tasks: removeFromList(state.task.sub_tasks || [], tempId) }
              : state.task;
          return { tasks: updated, task: currentTask };
        }

        const updated = new Map(state.tasks);
        for (const [taskId, task] of updated) {
          const newSubs = removeFromList(task.sub_tasks || [], tempId);
          if (newSubs !== task.sub_tasks) {
            updated.set(taskId, { ...task, sub_tasks: newSubs });
          }
        }
        const currentTask = state.task
          ? { ...state.task, sub_tasks: removeFromList(state.task.sub_tasks || [], tempId) }
          : state.task;
        return { tasks: updated, task: currentTask };
      });
      console.error("Error al crear subtask", error);
    }
  },

  toggleSubtask: async (parentId, subtaskId) => {
    const state = get();

    function toggleInList(list: Subtask[] | undefined, id: string, completed: boolean | undefined): Subtask[] {
      if (!list) return [];
      return list.map((s) => {
        if (s.id === id) return { ...s, is_completed: completed };
        return { ...s, sub_tasks: toggleInList(s.sub_tasks || [], id, completed) };
      });
    }

    const subtask = findSubtask(state, subtaskId);
    if (!subtask) return;

    const newCompleted = !subtask.is_completed;

    set((s) => {
      const updated = new Map(s.tasks);
      for (const [taskId, task] of updated) {
        const newSubs = toggleInList(task.sub_tasks || [], subtaskId, newCompleted);
        if (newSubs !== task.sub_tasks) {
          updated.set(taskId, { ...task, sub_tasks: newSubs });
        }
      }
      const currentTask = s.task
        ? { ...s.task, sub_tasks: toggleInList(s.task.sub_tasks || [], subtaskId, newCompleted) }
        : s.task;
      return { tasks: updated, task: currentTask };
    });

    try {
      await UpdateTask({ is_completed: newCompleted }, subtaskId);
    } catch (error) {
      set((s) => {
        const updated = new Map(s.tasks);
        for (const [taskId, task] of updated) {
          const newSubs = toggleInList(task.sub_tasks || [], subtaskId, subtask.is_completed);
          if (newSubs !== task.sub_tasks) {
            updated.set(taskId, { ...task, sub_tasks: newSubs });
          }
        }
        const currentTask = s.task
          ? { ...s.task, sub_tasks: toggleInList(s.task.sub_tasks || [], subtaskId, subtask.is_completed) }
          : s.task;
        return { tasks: updated, task: currentTask };
      });
      console.error("Error al actualizar subtask", error);
    }
  },

  removeSubtask: async (parentId, subtaskId) => {
    const state = get();

    function removeFromList(list: Subtask[], id: string): Subtask[] {
      return list
        .filter((s) => s.id !== id)
        .map((s) => ({ ...s, sub_tasks: removeFromList(s.sub_tasks || [], id) }));
    }

    const removed = findSubtask(state, subtaskId);
    console.log(`removeSubtask called: parentId=${parentId}, subtaskId=${subtaskId}, found=${!!removed}`);
    
    if (!removed) {
      console.log(`Subtask ${subtaskId} not found, trying direct delete`);
    } else {
      set((s) => {
        const updated = new Map(s.tasks);
        for (const [taskId, task] of updated) {
          const newSubs = removeFromList(task.sub_tasks || [], subtaskId);
          if (newSubs !== task.sub_tasks) {
            updated.set(taskId, { ...task, sub_tasks: newSubs });
          }
        }
        const currentTask = s.task
          ? { ...s.task, sub_tasks: removeFromList(s.task.sub_tasks || [], subtaskId) }
          : s.task;
        return { tasks: updated, task: currentTask };
      });
    }

    try {
      console.log(`Calling DeleteTask for subtask ${subtaskId}`);
      await DeleteTask(subtaskId);
      console.log(`DeleteTask succeeded for ${subtaskId}`);
    } catch (error) {
      console.error(`DeleteTask failed for ${subtaskId}:`, error);
      if (removed) {
        set((s) => {
          const updated = new Map(s.tasks);
          for (const [taskId, task] of updated) {
            const newSubs = addSubtaskToList(task.sub_tasks || [], parentId, removed);
            if (newSubs !== task.sub_tasks) {
              updated.set(taskId, { ...task, sub_tasks: newSubs });
            }
          }
          const currentTask = s.task
            ? { ...s.task, sub_tasks: addSubtaskToList(s.task.sub_tasks || [], parentId, removed) }
            : s.task;
          return { tasks: updated, task: currentTask };
        });
      }
      throw error;
    }
  },
}));
