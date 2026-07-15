import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/task_store";
import { useListStore } from "@/stores/list_store";
import { Badge } from "@/components/ui/badge";
import { Calendar, Hash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function KanbanCard({
  task,
  index,
}: {
  task: Task;
  index: number;
}) {
  const { setTask } = useTaskStore();
  const { lists } = useListStore();
  const list = lists.find((l) => l.id === task.list_id);

  return (
    <Draggable draggableId={task.id!} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setTask(task.id!)}
          className={cn(
            "bg-card border rounded-lg p-3 cursor-pointer transition-shadow select-none",
            snapshot.isDragging
              ? "shadow-lg ring-2 ring-primary/20"
              : "shadow-sm hover:shadow-md",
          )}
        >
          <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            {task.due_date && (
              <span
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]",
                  new Date(task.due_date) < new Date() && !task.is_completed
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Calendar className="h-2.5 w-2.5" />
                {format(new Date(task.due_date), "dd MMM")}
              </span>
            )}

            {task.sub_tasks && task.sub_tasks.length > 0 && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600">
                <Hash className="h-2.5 w-2.5" />
                {task.sub_tasks.length}
              </span>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-0.5">
                {task.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                ))}
              </div>
            )}

            {list && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 text-white ml-auto"
                style={{ backgroundColor: list.color }}
              >
                {list.title}
              </Badge>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
