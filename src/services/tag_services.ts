import { api_client, handleAxiosError } from "@/lib/api";
import { Tag } from "@/types/tag";

export async function FetchTags(taskId: string): Promise<Tag[]> {
  try {
    const response = await api_client.get<{ tags: Tag[] }>(
      `/api/tasks/${taskId}/tags`,
    );
    return response.data.tags;
  } catch (error) {
    handleAxiosError(error, "FetchTags");
  }
}

export async function AddTag(taskId: string, name: string): Promise<Tag> {
  try {
    const response = await api_client.post<{ tag: Tag }>(
      `/api/tasks/${taskId}/tags`,
      { name },
    );
    return response.data.tag;
  } catch (error) {
    handleAxiosError(error, "AddTag");
  }
}

export async function RemoveTag(
  taskId: string,
  tagId: string,
): Promise<void> {
  try {
    await api_client.delete(`/api/tasks/${taskId}/tags/${tagId}`);
  } catch (error) {
    handleAxiosError(error, "RemoveTag");
  }
}
