import { create } from "zustand";
import { Tag } from "@/types/tag";
import {
  FetchAllTags,
  CreateTag,
  DeleteTag,
} from "@/services/tag_services";
import toast from "react-hot-toast";

type TagState = {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag | undefined>;
  deleteTag: (id: string) => Promise<void>;
};

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],

  fetchTags: async () => {
    try {
      const tags = await FetchAllTags();
      set({ tags: tags || [] });
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  },

  createTag: async (name: string, color: string) => {
    const tempId = `temp-${Date.now()}`;
    const tempTag: Tag = { id: tempId, name, color };

    set((s) => ({ tags: [...s.tags, tempTag] }));

    try {
      const created = await CreateTag(name, color);
      set((s) => ({
        tags: s.tags.map((t) => (t.id === tempId ? created : t)),
      }));
      toast.success("Tag created");
      return created;
    } catch (error) {
      set((s) => ({
        tags: s.tags.filter((t) => t.id !== tempId),
      }));
      toast.error("Error creating tag");
      return undefined;
    }
  },

  deleteTag: async (id: string) => {
    const { tags } = get();
    const tag = tags.find((t) => t.id === id);
    if (!tag) return;

    set((s) => ({ tags: s.tags.filter((t) => t.id !== id) }));

    try {
      await DeleteTag(id);
      toast.success("Tag deleted");
    } catch (error) {
      set((s) => ({ tags: [...s.tags, tag] }));
      toast.error("Error deleting tag");
    }
  },
}));
