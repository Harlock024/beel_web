import { api_client, handleAxiosError } from "@/lib/api";
import { Task, TaskResponse } from "../types/task";
export async function FetchTasks({
  list_id,
}: {
  list_id: string | null;
}): Promise<TaskResponse> {
  if (!list_id) throw new Error("no list selected");

  try {
    const response = await api_client.get<TaskResponse>(
      `/api/lists/${list_id}/tasks`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "FetchTasks");
  }
}

export async function FetchTasksByFilter(
  filter: string,
): Promise<TaskResponse> {
  try {
    const response = await api_client.get<TaskResponse>(
      `/api/tasks?filter=${filter}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "FetchTasksByFilter");
  }
}

export async function CreateTask({
  title,
  list_id,
}: {
  title: string;
  list_id?: string;
}): Promise<Task> {
  try {
    const response = await api_client.post(`/api/lists/${list_id}/tasks`, {
      title,
    });
    return response.data.task;
  } catch (error) {
    handleAxiosError(error, "CreateTask");
  }
}

export async function UpdateTask(
  task: Partial<Task>,
  task_id: string,
): Promise<Task> {
  try {
    const response = await api_client.patch(`/api/tasks/${task_id}`, task);
    return response.data.task;
  } catch (error) {
    handleAxiosError(error, "UpdateTask");
  }
}

export async function DeleteTask(taskId: string): Promise<boolean> {
  try {
    const response = await api_client.delete(`/api/tasks/${taskId}`);
    return response.status === 204;
  } catch (error) {
    handleAxiosError(error, "DeleteTask");
  }
}
