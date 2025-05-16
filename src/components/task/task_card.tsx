import type { Task } from "@/types/task";
import { Label } from "@/components/ui/label";
import { Calendar, Hash, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useListStore } from "@/stores/list_store";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FormEvent, useState } from "react";
import { useTaskStore } from "@/stores/task_store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { TaskDetails } from "./task_details";
import { Card } from "../ui/card";

export function TaskCard({ task }: { task: Task }) {
  const [doneTask, setDoneTask] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { lists } = useListStore();
  const { setTask } = useTaskStore();

  const list = lists.find((list) => list.id === task.list_id);

  function handleSetTask(e: FormEvent) {
    e.preventDefault();
    setTask(task.id!);
    console.log("task id", task.id);
  }

  const handleDoneTask = (e: React.FormEvent) => {
    e.preventDefault();
    setDoneTask(!doneTask);
  };

  return (
    <div className="w-full flex  justify-center items-center">
      <Checkbox
        id={`task-${task.id}`}
        className="h-5 w-5 mt-1"
        role="checkbox"
        checked={doneTask}
        onClick={handleDoneTask}
      />
      <div className="flex   w-full px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors  items-center  gap-4">
        <button
          onClick={handleSetTask}
          className="text-gray-500 w-full   hover:bg-[#f5f5f5] rounded-sm   h-10 flex justify-center items-center hover:text-black transition"
        >
          <div className="flex-1 space-y-1 ">
            <div className="flex justify-between items-center w-full">
              <Label
                htmlFor={`task-${task.id}`}
                className={`font-medium cursor-pointer ${
                  doneTask ? "line-through text-gray-400" : "text-gray-900"
                }`}
              >
                {task.title}
              </Label>

              <ChevronRight
                className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(task.due_date, "dd-MM-yy")}</span>
                </div>
              )}

              {task?.sub_tasks?.length! > 0 && (
                <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                  <Hash className="h-3 w-3" />
                  <span>{task.sub_tasks!.length}</span>
                  <span>Subtasks</span>
                </div>
              )}

              {list && (
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-white hover:bg-red-100"
                  style={{ backgroundColor: list.color }}
                >
                  {list.title}
                </Badge>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
