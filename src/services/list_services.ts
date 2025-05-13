import { List, ListsResponseProp } from "@/types/list";
import { API_URL } from "./api_url";
import { useAuthStore } from "@/stores/useAuthStore";

export async function FetchLists(): Promise<ListsResponseProp> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/lists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
}

export async function CreateList(title: string, color: string): Promise<List> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/lists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, color }),
    });
    const data = await response.json();
    return data.list;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
}
export async function UpdateList(
  list: Partial<List>,
): Promise<ListsResponseProp> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/lists/${list.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: list.title, color: list.color }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
}

export async function DeleteList(id: string): Promise<void> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/lists/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete list: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
}
