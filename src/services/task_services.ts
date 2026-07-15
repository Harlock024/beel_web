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

export async function FetchTaskCount(): Promise<{ count: number }> {
  try {
    const response = await api_client.get<{ count: number }>("/api/tasks/count");
    return response.data;
  } catch (error) {
    handleAxiosError(error, "FetchTaskCount");
  }
}

export async function CreateTask({
  title,
  list_id,
  due_date,
}: {
  title: string;
  list_id?: string;
  due_date?: string;
}): Promise<Task> {
  try {
    if (list_id) {
      const response = await api_client.post(`/api/lists/${list_id}/tasks`, {
        title,
        due_date,
      });
      return response.data.task;
    }
    const response = await api_client.post("/api/tasks", {
      title,
      due_date,
    });
    return response.data.task || response.data;
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

export async function CreateKanbanTask({
  title,
  column_id,
  list_id,
}: {
  title: string;
  column_id: string;
  list_id?: string;
}): Promise<Task> {
  try {
    const response = await api_client.post("/api/tasks", {
      title,
      column_id,
      list_id,
    });
    return response.data.task || response.data;
  } catch (error) {
    handleAxiosError(error, "CreateKanbanTask");
  }
}
