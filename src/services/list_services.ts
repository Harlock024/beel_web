import { List, ListsResponseProp } from "@/types/list";
import { api_client, handleAxiosError } from "@/lib/api";
import { API_URL } from "./api_url";

export async function FetchLists(): Promise<ListsResponseProp> {
  try {
    const response = await api_client.get<ListsResponseProp>("/api/lists");
    return response.data;
  } catch (error) {
    handleAxiosError(error, "FetchLists");
  }
}

export async function CreateList(title: string, color: string): Promise<List> {
  try {
    const response = await api_client.post<{ list: List }>("/api/lists", {
      title,
      color,
    });
    return response.data.list;
  } catch (error) {
    handleAxiosError(error, "CreateList");
  }
}

export async function UpdateList(
  list: Partial<List>,
): Promise<ListsResponseProp> {
  try {
    const response = await api_client.put<ListsResponseProp>(
      `/api/lists/${list.id}`,
      {
        title: list.title,
        color: list.color,
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "UpdateList");
  }
}

export async function DeleteList(id: string): Promise<void> {
  try {
    await api_client.delete(`/api/lists/${id}`);
  } catch (error) {
    handleAxiosError(error, "DeleteList");
  }
}
