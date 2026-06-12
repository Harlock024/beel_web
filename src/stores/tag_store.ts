import { create } from "zustand";
import { Tag } from "@/types/tag";
import {
  FetchAllTags,
  CreateTag,
  DeleteTag,
  AssignTag,
  UnassignTag,
  FetchTaskTags,
} from "@/services/tag_services";
import toast from "react-hot-toast";

type TagState = {
  tags: Tag[];
  taskTags: Map<string, Tag[]>;
  fetchTags: () => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag | undefined>;
  deleteTag: (id: string) => Promise<void>;
  assignTag: (taskId: string, tagId: string) => Promise<void>;
  unassignTag: (taskId: string, tagId: string) => Promise<void>;
  fetchTaskTags: (taskId: string) => Promise<void>;
};

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  taskTags: new Map(),

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

  assignTag: async (taskId: string, tagId: string) => {
    const { taskTags } = get();
    const currentTags = taskTags.get(taskId) || [];

    if (currentTags.some((t) => t.id === tagId)) return;

    const { tags } = get();
    const tag = tags.find((t) => t.id === tagId);
    if (!tag) return;

    set((s) => ({
      taskTags: new Map(s.taskTags).set(taskId, [...currentTags, tag]),
    }));

    try {
      await AssignTag(taskId, tagId);
    } catch (error) {
      set((s) => ({
        taskTags: new Map(s.taskTags).set(
          taskId,
          currentTags.filter((t) => t.id !== tagId),
        ),
      }));
      toast.error("Error assigning tag");
    }
  },

  unassignTag: async (taskId: string, tagId: string) => {
    const { taskTags } = get();
    const currentTags = taskTags.get(taskId) || [];
    const tag = currentTags.find((t) => t.id === tagId);
    if (!tag) return;

    set((s) => ({
      taskTags: new Map(s.taskTags).set(
        taskId,
        currentTags.filter((t) => t.id !== tagId),
      ),
    }));

    try {
      await UnassignTag(taskId, tagId);
    } catch (error) {
      set((s) => ({
        taskTags: new Map(s.taskTags).set(taskId, [...currentTags, tag]),
      }));
      toast.error("Error removing tag");
    }
  },

  fetchTaskTags: async (taskId: string) => {
    try {
      const tags = await FetchTaskTags(taskId);
      set((s) => ({
        taskTags: new Map(s.taskTags).set(taskId, tags || []),
      }));
    } catch (error) {
      console.error("Error fetching task tags", error);
    }
  },
}));
