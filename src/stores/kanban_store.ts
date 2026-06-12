import { create } from "zustand";
import { Column } from "@/types/column";
import { Task } from "@/types/task";
import {
  FetchBoards,
  FetchBoardById,
  FetchColumns,
  CreateBoard,
  UpdateBoard,
  DeleteBoard,
  Board,
} from "@/services/board_services";
import {
  CreateColumn,
  UpdateColumn,
  DeleteColumn,
} from "@/services/column_services";
import { UpdateTask, CreateKanbanTask } from "@/services/task_services";
import { useTaskStore } from "./task_store";
import toast from "react-hot-toast";

type KanbanState = {
  boards: Board[];
  boardId: string | null;
  columns: Column[];
  loaded: boolean;

  fetchBoards: () => Promise<void>;
  selectBoard: (id: string) => Promise<void>;
  createBoard: (title: string) => Promise<void>;
  renameBoard: (id: string, title: string) => Promise<void>;
  removeBoard: (id: string) => Promise<void>;

  createColumn: (title: string) => Promise<void>;
  updateColumn: (id: string, title: string) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  addKanbanTask: (title: string, columnId: string) => Promise<void>;

  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destColumnId: string,
    sourceIndex: number,
    destIndex: number,
  ) => void;
};

export const useKanbanStore = create<KanbanState>((set, get) => ({
  boards: [],
  boardId: null,
  columns: [],
  loaded: false,

  fetchBoards: async () => {
    try {
      const boards = await FetchBoards();
      console.log("[Kanban] boards loaded:", boards);
      set({ boards, loaded: true });

      if (boards.length > 0 && !get().boardId && boards[0].id) {
        await get().selectBoard(boards[0].id);
      }
    } catch (error) {
      console.error("Error fetching boards", error);
      set({ loaded: true });
    }
  },

  selectBoard: async (id) => {
    if (!id) {
      console.error("[Kanban] selectBoard called with empty id");
      return;
    }
    try {
      const board = await FetchBoardById(id);
      const columns = await FetchColumns(id);

      const newTasks = new Map(useTaskStore.getState().tasks);
      for (const col of columns) {
        if (col.tasks) {
          for (const task of col.tasks) {
            newTasks.set(task.id!, { ...task, column_id: col.id });
          }
        }
      }
      useTaskStore.setState({ tasks: newTasks });

      set({
        boardId: board.id,
        columns: columns.map(({ tasks, ...col }) => col),
      });
    } catch (error) {
      console.error("Error fetching board", error);
      toast.error("Error loading board");
    }
  },

  createBoard: async (title) => {
    try {
      const board = await CreateBoard(title);
      set((state) => ({ boards: [...state.boards, board] }));
      await get().selectBoard(board.id);
      toast.success("Board created");
    } catch (error) {
      toast.error("Error creating board");
      console.error("Error creating board", error);
    }
  },

  renameBoard: async (id, title) => {
    const prev = get().boards.find((b) => b.id === id);
    if (!prev) return;

    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, title } : b)),
    }));

    try {
      await UpdateBoard(id, title);
    } catch (error) {
      set((state) => ({
        boards: state.boards.map((b) =>
          b.id === id ? { ...b, title: prev.title } : b,
        ),
      }));
      toast.error("Error renaming board");
      console.error("Error renaming board", error);
    }
  },

  removeBoard: async (id) => {
    const { boards, boardId } = get();
    const board = boards.find((b) => b.id === id);
    if (!board) return;

    set((state) => ({
      boards: state.boards.filter((b) => b.id !== id),
      boardId: boardId === id ? null : boardId,
      columns: boardId === id ? [] : get().columns,
    }));

    try {
      await DeleteBoard(id);
      toast.success("Board deleted");

      const remaining = get().boards;
      if (remaining.length > 0 && boardId === id) {
        await get().selectBoard(remaining[0].id);
      }
    } catch (error) {
      set((state) => ({
        boards: [...state.boards, board].sort(
          (a, b) => a.title.localeCompare(b.title),
        ),
        boardId,
        columns: get().columns,
      }));
      toast.error("Error deleting board");
      console.error("Error deleting board", error);
    }
  },

  createColumn: async (title) => {
    const { boardId, columns } = get();
    if (!boardId) return;

    const tempId = `temp-${Date.now()}`;
    const tempColumn: Column = {
      id: tempId,
      title,
      position: columns.length,
      board_id: boardId,
    };

    set((state) => ({ columns: [...state.columns, tempColumn] }));

    try {
      const created = await CreateColumn(boardId, title);
      set((state) => ({
        columns: state.columns.map((c) => (c.id === tempId ? created : c)),
      }));
      toast.success("Column created");
    } catch (error) {
      set((state) => ({
        columns: state.columns.filter((c) => c.id !== tempId),
      }));
      toast.error("Error creating column");
      console.error("Error creating column", error);
    }
  },

  updateColumn: async (id, title) => {
    const { columns } = get();
    const prev = columns.find((c) => c.id === id);
    if (!prev) return;

    set((state) => ({
      columns: state.columns.map((c) => (c.id === id ? { ...c, title } : c)),
    }));

    try {
      await UpdateColumn(id, { title });
    } catch (error) {
      set((state) => ({
        columns: state.columns.map((c) =>
          c.id === id ? { ...c, title: prev.title } : c,
        ),
      }));
      toast.error("Error updating column");
      console.error("Error updating column", error);
    }
  },

  deleteColumn: async (id) => {
    const { columns } = get();
    const deleted = columns.find((c) => c.id === id);
    if (!deleted) return;

    set((state) => ({
      columns: state.columns
        .filter((c) => c.id !== id)
        .map((c, i) => ({ ...c, position: i })),
    }));

    try {
      await DeleteColumn(id);
      toast.success("Column deleted");
    } catch (error) {
      set((state) => ({
        columns: [
          ...state.columns.slice(0, deleted.position),
          deleted,
          ...state.columns.slice(deleted.position),
        ].map((c, i) => ({ ...c, position: i })),
      }));
      toast.error("Error deleting column");
      console.error("Error deleting column", error);
    }
  },

  addKanbanTask: async (title, columnId) => {
    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = {
      id: tempId,
      title,
      column_id: columnId,
      is_completed: false,
      position: 0,
    };

    useTaskStore.setState((state) => {
      const updated = new Map(state.tasks);
      updated.set(tempId, tempTask);
      return { tasks: updated };
    });

    try {
      const created = await CreateKanbanTask({ title, column_id: columnId });
      useTaskStore.setState((state) => {
        const updated = new Map(state.tasks);
        updated.delete(tempId);
        updated.set(created.id!, { ...created, column_id: columnId });
        return { tasks: updated };
      });
    } catch (error) {
      useTaskStore.setState((state) => {
        const updated = new Map(state.tasks);
        updated.delete(tempId);
        return { tasks: updated };
      });
      toast.error("Error creating task");
      console.error("Error creating task", error);
    }
  },

  moveTask: (taskId, sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    const taskStore = useTaskStore.getState();
    const task = taskStore.tasks.get(taskId);
    if (!task) return;

    const prevColumnId = task.column_id;
    const prevPosition = task.position;

    useTaskStore.setState((state) => {
      const updated = new Map(state.tasks);
      updated.set(taskId, {
        ...task,
        column_id: destColumnId,
        position: destIndex,
      });
      return { tasks: updated };
    });

    UpdateTask({ column_id: destColumnId, position: destIndex }, taskId).catch(
      (error) => {
        console.error("Error moving task", error);
        useTaskStore.setState((state) => {
          const updated = new Map(state.tasks);
          updated.set(taskId, {
            ...task,
            column_id: prevColumnId,
            position: prevPosition,
          });
          return { tasks: updated };
        });
        toast.error("Error moving task");
      },
    );
  },
}));
