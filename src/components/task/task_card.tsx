import { useState } from "react";
import type { Task } from "@/types/task";
import { Label } from "@/components/ui/label";
import { Calendar, Hash, Ellipsis, Check } from "lucide-react";
import { format } from "date-fns";
import { useListStore } from "@/stores/list_store";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FormEvent } from "react";
import { useTaskStore } from "@/stores/task_store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: { task: Task }) {
  const { lists } = useListStore();
  const { setTask, removeTask } = useTaskStore();
  const [isCompleting, setIsCompleting] = useState(false);

  const list = lists.find((list) => list.id === task.list_id);

  function handleSetTask(e: FormEvent) {
    e.preventDefault();
    if (isCompleting) return; 
    setTask(task.id!);
  }

  const handleDoneTask = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsCompleting(true);
    
    toast.success("Task completed");
    
    setTimeout(() => {
      removeTask(task.id!);
    }, 800);
  };
  
  return (
    <div 
      className={cn(
        "group w-full flex mt-2 items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-300",
        isCompleting && "opacity-50 translate-x-2"
      )}
    >
      <div className="relative">
        <Checkbox
          id={`task-${task.id}`}
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-all",
            isCompleting ? "scale-125 bg-green-500 border-green-500" : "group-hover:scale-110"
          )}
          role="checkbox"
          checked={isCompleting || task.is_completed}
          onClick={handleDoneTask}
        />
        {isCompleting && (
          <Check className="h-3 w-3 text-white absolute top-1 left-1 animate-in zoom-in-50" />
        )}
      </div>
      
      <button
        onClick={handleSetTask}
        className={cn(
          "text-gray-700 w-full ml-3 py-2.5 px-3 rounded-md flex items-start justify-between transition-all",
          isCompleting && "line-through"
        )}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center w-full">
            <Label
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-medium text-sm md:text-base text-gray-800",
                isCompleting && "line-through text-gray-400"
              )}
            >
              {task.title}
            </Label>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {task.due_date && (
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                  new Date(task.due_date) < new Date() && !task.is_completed
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-100"
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), "dd MMM")}</span>
              </span>
            )}

            {task?.sub_tasks?.length! > 0 && (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                <Hash className="h-3 w-3" />
                <span>{task.sub_tasks!.length}</span>
              </span>
            )}

            {list && (
              <Badge
                variant="secondary"
                className="text-white text-xs px-2 rounded-md hover:opacity-90"
                style={{ backgroundColor: list.color }}
              >
                {list.title}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => e.stopPropagation()}
                disabled={isCompleting}
              >
                <Ellipsis className="size-5 text-gray-400 hover:text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-48" 
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setTask(task.id!);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(task.id!);
                }}
                className="text-red-500 focus:text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </button>
    </div>
  );
}
