import { API_URL } from "./api_url";
import { Task, TaskResponse } from "../types/task";

export async function FetchTasks({
  list_id,
}: {
  list_id: string | null;
}): Promise<TaskResponse> {
  if (!list_id) {
    throw new Error("no list selected");
  }
  try {
    const response = await fetch(`${API_URL}/api/lists/${list_id}/tasks`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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

export async function FetchTasksByFilter(
  filter: String,
): Promise<TaskResponse> {
  try {
    const response = await fetch(`${API_URL}/api/tasks?filter=${filter}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response filter", filter);
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
  console.log(title, list_id);

  try {
    const response = await fetch(`${API_URL}/api/lists/${list_id}/tasks`, {
      method: "POST",
      credentials: "include",
      headers: {
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
  try {
    const response = await fetch(API_URL + "/api/tasks/" + task_id, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
  const response = await fetch(API_URL + "/api/tasks/" + taskId, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 204) {
    return true;
  }

  return false;
}
