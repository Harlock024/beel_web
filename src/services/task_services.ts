import { API_URL } from "./api_url";
import { Task } from "../types/task";

export async function FetchTasks(): Promise<Task[]> {
  return fetch(API_URL + "/tasks", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function CreateTask(task: Task): Promise<Task> {
  return fetch(API_URL + "/tasks", {
    method: "POST",

    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function UpdateTask(task: Task): Promise<Task> {
  return fetch(API_URL + "/tasks/" + task.id, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function DeleteTask(taskId: string): Promise<boolean> {
  return fetch(API_URL + "/tasks/" + taskId, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => data);
}
