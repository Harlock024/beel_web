import { create } from "zustand";
import {
  CreateTask,
  DeleteTask,
  FetchTasks,
  UpdateTask,
} from "../services/task_services";
import { Task } from "../types/task";

type TaskState = {
  tasks: Task[];
  task?: Task;
  setTask: (id: string) => void;
  getTasks: () => void;
  closeTask: () => void;
  addTask: (newTask: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (updatedTask: Task) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  task: undefined,
  getTasks: async () => {
    const response = await FetchTasks();
    set({ tasks: response.tasks });
  },
  addTask: async (newTask: Task) => {
    const newTaskResponse = await CreateTask(newTask);

    set((state) => ({ tasks: [...state.tasks, newTaskResponse] }));
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
