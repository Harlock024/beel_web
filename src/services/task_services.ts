import { API_URL } from "./api_url";
import { Task, TaskResponse } from "../types/task";

import { useAuthStore } from "@/stores/useAuthStore";
import { List } from "lucide-react";
export async function FetchTasks(): Promise<TaskResponse> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(API_URL + "/api/tasks", {
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
  listId,
}: {
  title: string;
  listId?: string;
}): Promise<Task> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(API_URL + "/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        listId,
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

export async function UpdateTask(task: Task): Promise<Task> {
  const accessToken = useAuthStore.getState().accessToken;

  try {
    const response = await fetch(API_URL + "/api/tasks/" + task.id, {
      method: "PUT",
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
