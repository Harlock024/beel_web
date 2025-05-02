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
  getList: (id: string) => void;
  fetchLists: () => void;
  createList: (title: string, color: string) => void;
  updateList: (id: string, updatedList: Partial<List>) => void;
  deleteList: (id: string) => void;
  countedTask: (listId: string) => void;
};

export const useListStore = create<Store>((set, get) => ({
  lists: [
    {
      id: "1",
      title: "Lista de tareas",
      color: "#FF5733",
      tasks: [],
      tasksCount: 0,
    },
    {
      id: "2",
      title: "Lista de compras",
      color: "#33FF57",
      tasks: [],
      tasksCount: 0,
    },
    {
      id: "3",
      title: "Lista de pendientes",
      color: "#5733FF",
      tasks: [],
      tasksCount: 0,
    },
  ],
  selectedListId: null,

  getList: (id) => {
    set({ selectedListId: id });
  },
  fetchLists: async () => {
    const listsResponse = await FetchLists();
    console.log(listsResponse);
    set({ lists: listsResponse.lists });
  },
  // selectedList: () => {
  //   const { selectedListId, lists } = get();
  //   return lists.find((l) => l.id === selectedListId) || null;
  // },

  createList: async (title, color) => {
    const newListResponse = await CreateList(title, color);
    set((state) => ({ lists: [...state.lists, newListResponse] }));
  },
  updateList: async (id, updatedList) => {
    const updated = await UpdateList(id, updatedList);

    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === id ? { ...list, ...updated } : list,
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
