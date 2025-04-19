import { create } from "zustand";
import { FetchTasks } from "../services/task_services";
import { Task } from "../types/task";

type TaskState = {
  tasks: Task[];
  task?: Task;
  setTask: (id: string) => void;
  getTasks: () => void;
  closeTask: () => void;
  addTask: (newTask: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Task) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  task: undefined,
  getTasks: async () => {
    await FetchTasks().then((tasks) => set({ tasks }));
  },
  addTask: () => {},
  removeTask: (id: string) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },
  closeTask: () => {
    set(() => ({ task: undefined }));
  },
  setTask: (id) => {
    const task = useTaskStore.getState().tasks.find((task) => task.id === id);
    set({ task });
  },
  updateTask: (id: string, updatedTask: Task) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
    }));
  },
}));
