import { api_client, handleAxiosError } from "@/lib/api";
import { Column } from "@/types/column";

export type Board = {
  id: string;
  title: string;
  columns?: Column[];
};

export async function FetchBoards(): Promise<Board[]> {
  try {
    const response = await api_client.get("/api/boards");
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data.boards) return data.boards;
    return [];
  } catch (error) {
    handleAxiosError(error, "FetchBoards");
  }
}

export async function FetchBoardById(id: string): Promise<Board> {
  try {
    const response = await api_client.get(`/api/boards/${id}`);
    const data = response.data;
    const board = data.board || data;
    return board;
  } catch (error) {
    handleAxiosError(error, "FetchBoardById");
  }
}

export async function FetchColumns(boardId: string): Promise<Column[]> {
  try {
    const response = await api_client.get(
      `/api/boards/${boardId}/columns`,
    );
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data.columns) return data.columns;
    return [];
  } catch (error) {
    handleAxiosError(error, "FetchColumns");
  }
}

export async function CreateBoard(title: string): Promise<Board> {
  try {
    const response = await api_client.post("/api/boards", { title });
    const data = response.data;
    return data.board || data;
  } catch (error) {
    handleAxiosError(error, "CreateBoard");
  }
}

export async function UpdateBoard(
  id: string,
  title: string,
): Promise<Board> {
  try {
    const response = await api_client.patch(`/api/boards/${id}`, { title });
    const data = response.data;
    return data.board || data;
  } catch (error) {
    handleAxiosError(error, "UpdateBoard");
  }
}

export async function DeleteBoard(id: string): Promise<boolean> {
  try {
    const response = await api_client.delete(`/api/boards/${id}`);
    return response.status === 204;
  } catch (error) {
    handleAxiosError(error, "DeleteBoard");
  }
}
