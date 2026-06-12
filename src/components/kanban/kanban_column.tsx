import { useState, useRef, useEffect } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Column } from "@/types/column";
import { Task } from "@/types/task";
import { KanbanCard } from "./kanban_card";
import { useKanbanStore } from "@/stores/kanban_store";
import { Ellipsis, Trash2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function KanbanColumn({
  column,
  tasks,
}: {
  column: Column;
  tasks: Task[];
}) {
  const { updateColumn, deleteColumn, addKanbanTask } = useKanbanStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (isAddingTask) taskInputRef.current?.focus();
  }, [isAddingTask]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== column.title) {
      updateColumn(column.id!, trimmed);
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleAddTask = () => {
    const trimmed = newTaskTitle.trim();
    if (trimmed) {
      addKanbanTask(trimmed, column.id!);
      setNewTaskTitle("");
    }
    setIsAddingTask(false);
  };

  return (
    <div className="flex flex-col bg-muted/20 rounded-lg min-w-[280px] max-w-[280px] shrink-0 h-full">
      <div className="flex items-center justify-between px-3 py-2.5 shrink-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") {
                setTitle(column.title);
                setIsEditing(false);
              }
            }}
            className="text-sm font-semibold bg-transparent outline-none border-b border-primary w-full px-1"
          />
        ) : (
          <h3 className="text-sm font-semibold text-foreground truncate flex-1">
            {column.title}
          </h3>
        )}

        <div className="flex items-center gap-1 ml-2 shrink-0">
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Ellipsis className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteColumn(column.id!)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Droppable droppableId={column.id!} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[40px] transition-colors rounded-b-lg",
              snapshot.isDraggingOver && "bg-primary/5",
            )}
          >
            {tasks.map((task, index) => (
              <KanbanCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}

            {isAddingTask ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTask();
                }}
                className="bg-card border rounded-lg p-2"
              >
                <input
                  ref={taskInputRef}
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setNewTaskTitle("");
                      setIsAddingTask(false);
                    }
                  }}
                  onBlur={handleAddTask}
                  placeholder="Task title..."
                  className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </form>
            ) : (
              <button
                onClick={() => setIsAddingTask(true)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add task
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
