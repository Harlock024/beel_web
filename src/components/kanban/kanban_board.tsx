import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useKanbanStore } from "@/stores/kanban_store";
import { useTaskStore } from "@/stores/task_store";
import { KanbanColumn } from "./kanban_column";
import { KanbanColumnForm } from "./kanban_column_form";
import { BoardSelector } from "./board_selector";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KanbanBoard() {
  const {
    boards,
    boardId,
    columns,
    loaded,
    fetchBoards,
    renameBoard,
    removeBoard,
    deselectBoard,
    moveTask,
    moveColumn,
  } = useKanbanStore();
  const { tasks } = useTaskStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const currentBoard = boards.find((b) => b.id === boardId);

  if (!loaded) {
    return (
      <div className="flex gap-4 p-4 overflow-hidden h-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2 min-w-[280px]">
            <div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
            <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
            <div className="h-20 w-full rounded-lg bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!boardId) {
    return <BoardSelector />;
  }

  const getColumnTasks = (columnId: string) => {
    return Array.from(tasks.values())
      .filter((t) => t.column_id === columnId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "COLUMN") {
      moveColumn(draggableId, source.index, destination.index);
      return;
    }

    moveTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
    );
  };

  const handleRenameBoard = () => {
    if (renameValue.trim() && boardId) {
      renameBoard(boardId, renameValue.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => deselectBoard()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <span className="font-semibold text-lg truncate">
          {currentBoard?.title}
        </span>

        {isRenaming ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRenameBoard();
            }}
            className="flex gap-1"
          >
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => setIsRenaming(false)}
              className="px-2 py-1 text-sm border rounded-md bg-background outline-none focus:ring-1 focus:ring-ring"
            />
          </form>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setRenameValue(currentBoard?.title || "");
              setIsRenaming(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            if (confirm("Delete this board and all its columns?")) {
              removeBoard(boardId);
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 p-4 overflow-x-auto flex-1"
            >
              {columns.map((col, index) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={getColumnTasks(col.id!)}
                  index={index}
                />
              ))}
              {provided.placeholder}
              <KanbanColumnForm />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
