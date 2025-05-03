import type { Task } from "@/types/task";
import { Label } from "@/components/ui/label";
import { Calendar, Hash, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useListStore } from "@/stores/list_store";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useTaskStore } from "@/stores/task_store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { TaskDetails } from "./task_details";

export function TaskCard({ task }: { task: Task }) {
  const [doneTask, setDoneTask] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Empieza cerrado
  const { lists } = useListStore();

  const list = lists.find((list) => list.id === task.list_id);

  const handleDoneTask = (e: React.FormEvent) => {
    e.preventDefault();
    setDoneTask(!doneTask);
  };

  return (
    <Collapsible className="w-full" open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex  w-full px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors  items-center  gap-4">
        <Checkbox
          id={`task-${task.id}`}
          className="h-5 w-5 mt-1"
          role="checkbox"
          checked={doneTask}
          onClick={handleDoneTask}
        />

        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
            <Label
              htmlFor={`task-${task.id}`}
              className={`font-medium cursor-pointer ${
                doneTask ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {task.title}
            </Label>
            <CollapsibleTrigger asChild>
              <button className="text-gray-500  hover:bg-[#f5f5f5] rounded-sm  w-10 h-10 flex justify-center items-center hover:text-black transition">
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </CollapsibleTrigger>
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
                className="bg-red-100 text-red-600 hover:bg-red-100"
              >
                {list.title}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <CollapsibleContent className="pl-10 pr-4 pb-4">
        <TaskDetails task={task} />
      </CollapsibleContent>
    </Collapsible>
  );
}
