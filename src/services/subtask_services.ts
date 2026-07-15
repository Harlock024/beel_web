import { api_client, handleAxiosError } from "@/lib/api";
import { Subtask } from "@/types/subTask";

export async function FetchSubtasks(taskId: string): Promise<Subtask[]> {
  try {
    const response = await api_client.get<{ subtasks: Subtask[] }>(
      `/api/tasks/${taskId}/subtasks`,
    );
    return response.data.subtasks;
  } catch (error) {
    handleAxiosError(error, "FetchSubtasks");
  }
}

export async function CreateSubtask(
  taskId: string,
  title: string,
): Promise<Subtask> {
  try {
    const response = await api_client.post<{ subtask: Subtask }>(
      `/api/tasks/${taskId}/subtasks`,
      { title },
    );
    return response.data.subtask;
  } catch (error) {
    handleAxiosError(error, "CreateSubtask");
  }
}

export async function UpdateSubtask(
  taskId: string,
  subtaskId: string,
  data: Partial<Subtask>,
): Promise<Subtask> {
  try {
    const response = await api_client.patch<{ subtask: Subtask }>(
      `/api/tasks/${taskId}/subtasks/${subtaskId}`,
      data,
    );
    return response.data.subtask;
  } catch (error) {
    handleAxiosError(error, "UpdateSubtask");
  }
}

export async function DeleteSubtask(
  taskId: string,
  subtaskId: string,
): Promise<void> {
  try {
    await api_client.delete(`/api/tasks/${taskId}/subtasks/${subtaskId}`);
  } catch (error) {
    handleAxiosError(error, "DeleteSubtask");
  }
}
