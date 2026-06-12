import { api_client, handleAxiosError } from "@/lib/api";
import { Tag } from "@/types/tag";
import { useAuthStore } from "@/stores/useAuthStore";

// Global tags
export async function FetchAllTags(): Promise<Tag[]> {
  try {
    const response = await api_client.get<{ tags: Tag[] }>("/api/tags");
    return response.data.tags;
  } catch (error) {
    handleAxiosError(error, "FetchAllTags");
  }
}

export async function CreateTag(name: string, color: string): Promise<Tag> {
  try {
    const { user } = useAuthStore.getState();
    const response = await api_client.post<{ tag: Tag }>("/api/tags", {
      name,
      color,
      user_id: user?.id,
    });
    return response.data.tag;
  } catch (error) {
    handleAxiosError(error, "CreateTag");
  }
}

export async function UpdateTag(
  id: string,
  data: Partial<Tag>,
): Promise<Tag> {
  try {
    const response = await api_client.put<{ tag: Tag }>(`/api/tags/${id}`, data);
    return response.data.tag;
  } catch (error) {
    handleAxiosError(error, "UpdateTag");
  }
}

export async function DeleteTag(id: string): Promise<void> {
  try {
    await api_client.delete(`/api/tags/${id}`);
  } catch (error) {
    handleAxiosError(error, "DeleteTag");
  }
}

// Task-tag assignment
export async function AssignTag(taskId: string, tagId: string): Promise<Tag> {
  try {
    const response = await api_client.post<{ tag: Tag }>(
      `/api/tasks/${taskId}/tags/${tagId}`,
    );
    return response.data.tag;
  } catch (error) {
    handleAxiosError(error, "AssignTag");
  }
}

export async function UnassignTag(
  taskId: string,
  tagId: string,
): Promise<void> {
  try {
    await api_client.delete(`/api/tasks/${taskId}/tags/${tagId}`);
  } catch (error) {
    handleAxiosError(error, "UnassignTag");
  }
}
