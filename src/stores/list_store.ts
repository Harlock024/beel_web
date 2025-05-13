import { create } from "zustand";
import { List } from "@/types/list";
import { useTaskStore } from "@/stores/task_store";
import {
  CreateList,
  DeleteList,
  FetchLists,
  UpdateList,
} from "@/services/list_services";

type Store = {
  lists: List[];
  selectedListId: string | null;

  // Acciones
  setSelectedList: (id: string) => void;
  fetchLists: () => void;
  createList: (title: string, color: string) => void;
  updateList: (updatedList: Partial<List>) => void;
  deleteList: (id: string) => void;
  countedTask: (listId: string) => void;
};

export const useListStore = create<Store>((set, get) => ({
  lists: [],
  selectedListId: null,
  setSelectedList: (id) => {
    set({ selectedListId: id });
  },
  fetchLists: async () => {
    const listsResponse = await FetchLists();

    set({ lists: listsResponse.lists });
  },

  createList: async (title, color) => {
    const newListResponse = await CreateList(title, color);
    set((state) => ({ lists: [...state.lists, newListResponse] }));
  },
  updateList: async (updatedList) => {
    const updated = await UpdateList(updatedList);

    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === updatedList.id ? { ...list, ...updated } : list,
      ),
    }));
  },
  deleteList: async (id) => {
    await DeleteList(id);
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
