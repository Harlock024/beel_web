import { create } from "zustand";
import { List } from "@/types/list";
import { useTaskStore } from "@/stores/task_store";
import {
  CreateList,
  DeleteList,
  FetchLists,
  UpdateList,
} from "@/services/list_services";
import { persist } from "zustand/middleware";

type Store = {
  lists: List[];
  selectedListId: string | null;
  selectedTitleList: string | null;
  listsLoaded: boolean;

  // Acciones
  setSelectedList: (id: string) => void;
  fetchLists: () => void;
  createList: (title: string, color: string) => void;
  updateList: (updatedList: Partial<List>) => void;
  deleteList: (id: string) => void;
};

export const useListStore = create<Store>()(
  persist(
    (set, get) => ({
      lists: [],
      selectedTitleList: null,
      selectedListId: null,
      listsLoaded: false,

      setSelectedList: (id) => {
        set({
          selectedListId: id,
          selectedTitleList:
            get().lists.find((list) => list.id === id)?.title || null,
        });
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
          selectedListId:
            state.selectedListId === id ? null : state.selectedListId,
        }));
      },
    }),
    {
      name: "list-storage",
      partialize: (state) => ({
        lists: state.lists,
        selectedListId: state.selectedListId,
        listsLoaded: state.listsLoaded,
      }),
    },
  ),
);
