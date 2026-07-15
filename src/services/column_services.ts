import { api_client, handleAxiosError } from "@/lib/api";
import { Column } from "@/types/column";

export async function CreateColumn(
  board_id: string,
  title: string,
): Promise<Column> {
  try {
    const response = await api_client.post(
      `/api/boards/${board_id}/columns`,
      { title },
    );
    const data = response.data;
    if (data.column) return data.column;
    return data;
  } catch (error) {
    handleAxiosError(error, "CreateColumn");
  }
}

export async function UpdateColumn(
  id: string,
  data: Partial<Pick<Column, "title" | "position">>,
): Promise<Column> {
  try {
    const response = await api_client.patch(`/api/columns/${id}`, data);
    const res = response.data;
    if (res.column) return res.column;
    return res;
  } catch (error) {
    handleAxiosError(error, "UpdateColumn");
  }
}

export async function DeleteColumn(id: string): Promise<boolean> {
  try {
    const response = await api_client.delete(`/api/columns/${id}`);
    return response.status === 204;
  } catch (error) {
    handleAxiosError(error, "DeleteColumn");
  }
}
