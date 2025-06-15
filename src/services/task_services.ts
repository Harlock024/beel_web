import { API_URL } from "./api_url";
import { Task, TaskResponse } from "../types/task";
import { useAuthStore } from "@/stores/useAuthStore";

export async function FetchTasks({
  list_id,
}: {
  list_id: string | null;
}): Promise<TaskResponse> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  if (!list_id) {
    throw new Error("no list selected");
  }
  try {
    const response = await fetch(`${API_URL}/api/lists/${list_id}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TaskResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function CreateTask({
  title,
  list_id,
}: {
  title: string;
  list_id?: string;
}): Promise<Task> {
  const accessToken = useAuthStore.getState().accessToken;

  console.log(title, list_id);

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/lists/${list_id}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.task;
  } catch (error) {
    throw error;
  }
}

export async function UpdateTask(
  task: Partial<Task>,
  task_id: string,
): Promise<Task> {
  const accessToken = useAuthStore.getState().accessToken;

  try {
    const response = await fetch(API_URL + "/api/tasks/" + task_id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    throw error;
  }
}

export async function DeleteTask(taskId: string): Promise<boolean> {
  const accessToken = useAuthStore.getState().accessToken;

  return fetch(API_URL + "/api/tasks/" + taskId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}
