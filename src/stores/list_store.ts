import { create } from "zustand";
import { List } from "@/types/list";
import { useTaskStore } from "@/stores/task_store";

type Store = {
  lists: List[];
  selectedListId: string | null;

  // Acciones
  getList: (id: string) => void;
  createList: (list: List) => void;
  updateList: (id: string, updatedList: Partial<List>) => void;
  deleteList: (id: string) => void;
  countedTask: (listId: string) => void;

  // Getters
  selectedList: () => List | null;
};

export const useListStore = create<Store>((set, get) => ({
  lists: [],
  selectedListId: null,

  getList: (id) => {
    set({ selectedListId: id });
  },

  selectedList: () => {
    const { selectedListId, lists } = get();
    return lists.find((l) => l.id === selectedListId) || null;
  },

  createList: (list) => {
    set((state) => ({ lists: [...state.lists, list] }));
  },

  updateList: (id, updatedList) => {
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === id ? { ...list, ...updatedList } : list,
      ),
    }));
  },

  deleteList: (id) => {
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== id),
      selectedListId: state.selectedListId === id ? null : state.selectedListId,
    }));
  },

  countedTask: (listId: string) => {
    const taskList = useTaskStore.getState().tasks;
    const taskCount = taskList.filter((task) => task.list_id === listId);
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? { ...list, numTaskAsigned: taskCount.length }
          : list,
      ),
    }));
  },
}));
