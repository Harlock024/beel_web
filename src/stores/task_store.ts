import { create } from "zustand";
import {
  CreateTask,
  DeleteTask,
  FetchTasks,
  UpdateTask,
} from "../services/task_services";
import { Task } from "../types/task";
import { useListStore } from "./list_store";

type TaskState = {
  tasks: Task[];
  task?: Task;
  setTask: (id: string) => void;
  getTasks: (list_id: string) => void;
  closeTask: () => void;
  addTask: (newTask: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (updatedTask: Task) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  task: undefined,
  getTasks: async (list_id) => {
    set({ tasks: [] });

    const response = await FetchTasks({ list_id });
    set({ tasks: response.tasks });
  },
  addTask: async (newTask: Task) => {
    const tempId = `temp-${Date.now()}`;

    const prevTask: Task = {
      id: tempId,
      title: newTask.title,
      completed: newTask.completed,
      list_id: newTask.list_id,
    };
    set((state) => ({ tasks: [...(state.tasks ?? []), prevTask] }));

    try {
      const newTaskResponse = await CreateTask(newTask);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === tempId ? newTaskResponse : task,
        ),
      }));
    } catch (error) {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== tempId),
      }));
      console.error("error al crear tarea", error);
    }
  },
  removeTask: async (id: string) => {
    await DeleteTask(id);
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },
  closeTask: () => {
    set(() => ({ task: undefined }));
  },
  setTask: (id) => {
    const task = useTaskStore.getState().tasks.find((task) => task.id === id);
    set({ task });
  },
  updateTask: async (updatedTask: Task) => {
    await UpdateTask(updatedTask);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    }));
  },
}));
