import { useEffect, useState, useRef } from "react";
import { Task } from "@/types/task";
import { Tag } from "@/types/tag";
import { Subtask } from "@/types/subTask";
import { useTaskStore } from "@/stores/task_store";
import { useTagStore } from "@/stores/tag_store";
import { FetchSubtasks } from "@/services/subtask_services";
import { UpdateTask } from "@/services/task_services";
import { Check, ChevronRight, PanelRightOpen, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarDemo } from "../calendar/CalentadarDemo";
import { useListStore } from "@/stores/list_store";
import { useKanbanStore } from "@/stores/kanban_store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { List } from "@/types/list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TaskDetailsProps = {
  className?: string;
};

export function TaskDetails({ className }: TaskDetailsProps) {
  const { updateTask, removeTask, closeTask, task } = useTaskStore();
  const { lists } = useListStore();
  const [currentTask, setCurrentTask] = useState<Task | undefined>(task);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentTask(task);
    setIsFullScreen(true);
  }, [task?.id]);

  const handleClose = () => {
    setIsFullScreen(true);
    closeTask();
  };

  const handleSendToSidebar = () => {
    setIsFullScreen(false);
  };

  const handleBackToModal = () => {
    setIsFullScreen(true);
  };

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!isSaving && hasTaskChanged()) {
          handleEditTask();
        }
      }
      if (e.key === "Escape" && isFullScreen) {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [currentTask, task, isSaving, isFullScreen]);

  const handleEditTask = async () => {
    if (!currentTask || isSaving) return;
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      const changes: Partial<Task> = {};
      const trimmedTitle = currentTask.title.trim();
      const trimmedDescription = currentTask.description?.trim() || undefined;

      if (trimmedTitle !== task?.title) {
        if (!trimmedTitle) {
          toast.error("Title cannot be empty");
          toast.dismiss(toastId);
          setIsSaving(false);
          return;
        }
        changes.title = trimmedTitle;
      }
      if (trimmedDescription !== task?.description) {
        changes.description = trimmedDescription;
      }

      const dueDate = currentTask.due_date || undefined;
      if (dueDate !== task?.due_date) {
        changes.due_date = dueDate;
      }

      if (currentTask.list_id !== task?.list_id) {
        changes.list_id = currentTask.list_id;
      }

      if (currentTask.column_id !== task?.column_id) {
        changes.column_id = currentTask.column_id;
      }

      if (Object.keys(changes).length === 0) {
        toast.dismiss(toastId);
        setIsSaving(false);
        return;
      }
      updateTask(changes, currentTask.id || "");
      toast.success("Saved changes", { id: toastId });
    } catch (error) {
      toast.error("Error saving changes", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTask = async () => {
    if (!task?.id) return;

    removeTask(task.id);
    if (task.list_id) toast.success("Task removed successfully");
    closeTask();
  };

  const handleDateChange = (date: Date | undefined) => {
    setCurrentTask((prev) =>
      prev ? { ...prev, due_date: date?.toISOString() } : undefined,
    );
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newListId = e.target.value;
    setCurrentTask((prev) => {
      if (!prev) return undefined;
      return { ...prev, list_id: newListId };
    });
  };

  const handleColumnChange = (columnId: string) => {
    setCurrentTask((prev) => {
      if (!prev) return undefined;
      return { ...prev, column_id: columnId };
    });
  };

  function hasTaskChanged() {
    if (!currentTask || !task) return false;
    if (currentTask.id !== task.id) return true;

    return (
      currentTask.title.trim() !== task.title.trim() ||
      currentTask.description?.trim() !== task.description?.trim() ||
      (currentTask.due_date || "") !== (task.due_date || "") ||
      (currentTask.list_id || "") !== (task.list_id || "") ||
      (currentTask.column_id || "") !== (task.column_id || "")
    );
  }

  const taskContent = currentTask ? (
    <>
      <TaskDetailsActions
        currentTask={currentTask}
        lists={lists}
        handleListChange={handleListChange}
        handleDateChange={handleDateChange}
        handleColumnChange={handleColumnChange}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEditTask();
        }}
        className="px-6 py-4"
      >
        <textarea
          className="w-full bg-transparent outline-none resize-none min-h-[200px] text-sm placeholder:text-muted-foreground border-muted-foreground focus:border-primary transition-all"
          value={currentTask.description || ""}
          onChange={(e) =>
            setCurrentTask((prev) =>
              prev ? { ...prev, description: e.target.value } : undefined,
            )
          }
          placeholder="Write something about this task..."
        />
      </form>

      {currentTask.id && !currentTask.id.startsWith("temp-") && (
        <SubtaskSection task={currentTask} />
      )}

      {currentTask.id && !currentTask.id.startsWith("temp-") && (
        <TagSection task={currentTask} />
      )}
    </>
  ) : null;

  return (
    <>
      <Dialog open={isFullScreen && !!task} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent showCloseButton={false} className="max-w-3xl h-[85vh] p-0 gap-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="flex-1">
                <input
                  type="text"
                  value={currentTask?.title || ""}
                  onChange={(e) =>
                    setCurrentTask((prev) =>
                      prev ? { ...prev, title: e.target.value } : undefined,
                    )
                  }
                  placeholder="Task name"
                  className="text-xl font-semibold w-full bg-transparent outline-none border-none focus:ring-0 border-b border-transparent focus:border-primary transition-all"
                />
              </DialogTitle>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSendToSidebar}
                  title="Send to sidebar"
                >
                  <PanelRightOpen className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleClose}
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {taskContent}
          </div>

          <TaskDetailsFooter
            hasChanges={hasTaskChanged()}
            isSaving={isSaving}
            onSave={handleEditTask}
            onRemove={handleRemoveTask}
          />
        </DialogContent>
      </Dialog>

      {task && !isFullScreen && (
        <div
          className={cn(
            "top-0 h-screen z-50 bg-card shadow-lg border-l absolute right-0 transition-all duration-300",
            className,
          )}
          style={{ width: "400px" }}
        >
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleClose}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBackToModal}
                  title="Expand to modal"
                >
                  <PanelRightOpen className="w-4 h-4 rotate-180" />
                </Button>
              </div>
              <input
                type="text"
                value={currentTask?.title || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, title: e.target.value } : undefined,
                  )
                }
                placeholder="Task name"
                className="text-xl font-semibold w-full bg-transparent outline-none border-none focus:ring-0 border-b border-transparent focus:border-primary transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {taskContent}
            </div>

            <TaskDetailsFooter
              hasChanges={hasTaskChanged()}
              isSaving={isSaving}
              onSave={handleEditTask}
              onRemove={handleRemoveTask}
            />
          </div>
        </div>
      )}
    </>
  );
}

function TaskDetailsActions({
  currentTask,
  lists,
  handleListChange,
  handleDateChange,
  handleColumnChange,
}: {
  currentTask: Task | undefined;
  lists: List[];
  handleListChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDateChange: (date: Date | undefined) => void;
  handleColumnChange: (columnId: string) => void;
}) {
  const { columns } = useKanbanStore();

  return (
    <div className="px-6 py-4 space-y-6 border-b">
      <div className="flex justify-start gap-2 items-center space-y-2">
        <label className="block text-sm  font-medium mb-1">List</label>

        <div className="w-full">
          <Select
            value={currentTask?.list_id || ""}
            onValueChange={(value) => {
              handleListChange({
                target: { value },
              } as React.ChangeEvent<HTMLSelectElement>);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a list" />
            </SelectTrigger>
            <SelectContent>
              {lists.map((list) => (
                <SelectItem
                  key={list.id}
                  value={list.id!}
                  className="cursor-pointer hover:bg-accent"
                >
                  {list.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {columns.length > 0 && (
        <div className="flex justify-start gap-2 items-center space-y-2">
          <label className="block text-sm font-medium mb-1">Column</label>
          <div className="w-full">
            <Select
              value={currentTask?.column_id || ""}
              onValueChange={handleColumnChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem
                    key={col.id}
                    value={col.id!}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {col.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {currentTask?.due_date ? (
                format(new Date(currentTask.due_date), "PPP")
              ) : (
                <span>Select a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarDemo
              selectedDate={
                currentTask?.due_date
                  ? new Date(currentTask.due_date)
                  : undefined
              }
              onDataChange={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function TaskDetailsFooter({
  hasChanges,
  isSaving,
  onSave,
  onRemove,
}: {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="px-6 py-4 border-t mt-auto sticky bottom-0 bg-card z-10 flex items-center justify-between gap-4">
      <Button
        variant="destructive"
        size="sm"
        onClick={onRemove}
        className="text-sm"
        disabled={isSaving}
      >
        Remove Task
      </Button>

      <div className="flex items-center gap-2">
        {hasChanges && !isSaving && (
          <span className="text-xs text-muted-foreground">
            Press Ctrl+S to save
          </span>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          className="text-sm"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function SubtaskSection({ task }: { task: Task }) {
  const { addSubtask, toggleSubtask, removeSubtask } = useTaskStore();
  const [newTitle, setNewTitle] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.sub_tasks || []);
  const [loading, setLoading] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);

  const fetchSubtasks = async () => {
    if (!task.id) return;
    setLoading(true);
    try {
      const fetched = await FetchSubtasks(task.id);
      setSubtasks(fetched);
    } catch {
      setSubtasks(task.sub_tasks || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtasks();
  }, [task.id]);

  useEffect(() => {
    setSubtasks(task.sub_tasks || []);
  }, [task.sub_tasks]);

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    console.log(`SubtaskSection.handleAdd: task.id=${task.id}, title=${title}`);
    await addSubtask(task.id!, title);
    setNewTitle("");
    await fetchSubtasks();
  };

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">
          Subtasks
          {subtasks.length > 0 && (
            <span className="ml-2 text-muted-foreground">
              {subtasks.length}
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-1">
        {loading && subtasks.length === 0 ? (
          <span className="text-xs text-muted-foreground">Loading...</span>
        ) : (
          subtasks.map((subtask) => (
            <button
              key={subtask.id}
              onClick={() => setSelectedSubtask(subtask)}
              className="w-full flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent/50 group text-left transition-colors"
            >
              <Checkbox
                checked={subtask.is_completed}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => {
                  toggleSubtask(task.id!, subtask.id);
                }}
                className="h-4 w-4"
              />
              <span className={cn("flex-1 text-sm", subtask.is_completed && "line-through text-muted-foreground")}>
                {subtask.title}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          ))
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="flex items-center gap-2 mt-2"
      >
        <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add subtask..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>

      {selectedSubtask && (
        <SubtaskModal
          subtask={selectedSubtask}
          taskId={task.id!}
          onClose={() => setSelectedSubtask(null)}
          onUpdate={fetchSubtasks}
        />
      )}
    </div>
  );
}

function SubtaskModal({
  subtask,
  taskId,
  onClose,
  onUpdate,
}: {
  subtask: Subtask;
  taskId: string;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const { toggleSubtask, removeSubtask } = useTaskStore();
  const [newTitle, setNewTitle] = useState(subtask.title);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubtasks = async () => {
    setLoading(true);
    try {
      const fetched = await FetchSubtasks(subtask.id);
      setSubtasks(fetched);
    } catch {
      setSubtasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtasks();
  }, [subtask.id]);

  const handleComplete = async () => {
    await UpdateTask({ is_completed: true }, subtask.id);
    onUpdate();
    onClose();
  };

  const handleRemove = async () => {
    await removeSubtask(taskId, subtask.id);
    onUpdate();
    onClose();
  };

  const handleAddSubtask = async () => {
    const title = newSubtaskTitle.trim();
    if (!title) return;
    const { addSubtask } = useTaskStore.getState();
    await addSubtask(subtask.id, title);
    setNewSubtaskTitle("");
    await fetchSubtasks();
    onUpdate();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-2xl h-[80vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex-1">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-lg font-semibold w-full bg-transparent outline-none border-none focus:ring-0 border-b border-transparent focus:border-primary transition-all"
                placeholder="Subtask name"
              />
            </DialogTitle>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComplete}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Mark complete
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Description
              </h4>
              <textarea
                className="w-full bg-transparent outline-none resize-none min-h-[100px] text-sm placeholder:text-muted-foreground border border-border rounded-md p-3 focus:border-primary transition-all"
                placeholder="Add a description..."
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Subtasks
                {subtasks.length > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    {subtasks.length}
                  </span>
                )}
              </h4>
              <div className="space-y-1">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={st.is_completed}
                      onCheckedChange={() => {
                        toggleSubtask(subtask.id, st.id);
                      }}
                      className="h-4 w-4"
                    />
                    <span className={cn("flex-1 text-sm", st.is_completed && "line-through text-muted-foreground")}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddSubtask();
                }}
                className="flex items-center gap-2 mt-2"
              >
                <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add subtask..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </form>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t mt-auto sticky bottom-0 bg-card z-10 flex items-center justify-between gap-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="text-sm"
          >
            Remove Subtask
          </Button>
          <Button variant="default" size="sm" onClick={onClose} className="text-sm">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TagSection({ task }: { task: Task }) {
  const {
    tags: allTags,
    fetchTags,
    createTag,
    assignTag,
    unassignTag,
  } = useTagStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [assignedIds, setAssignedIds] = useState<Set<string>>(
    new Set((task.tags || []).map((t) => t.id).filter(Boolean) as string[]),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const TAG_COLORS = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
  ];

  useEffect(() => {
    fetchTags();
  }, [task.id]);

  useEffect(() => {
    setAssignedIds(new Set((task.tags || []).map((t) => t.id).filter(Boolean) as string[]));
  }, [task.tags, task.id]);

  const displayTags = allTags.filter((t) => assignedIds.has(t.id!));

  const filteredTags = allTags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const isAssigned = (tagId: string) => assignedIds.has(tagId);

  const exactMatch = allTags.some(
    (t) => t.name.toLowerCase() === search.toLowerCase(),
  );
  const showCreate = search.trim() && !exactMatch;

  const handleToggle = async (tag: Tag) => {
    if (!task.id || !tag.id) return;
    if (isAssigned(tag.id)) {
      setAssignedIds((prev) => {
        const next = new Set(prev);
        next.delete(tag.id!);
        return next;
      });
      await unassignTag(task.id, tag.id);
    } else {
      setAssignedIds((prev) => new Set(prev).add(tag.id!));
      await assignTag(task.id, tag.id);
    }
  };

  const handleCreateAndAssign = async () => {
    const name = search.trim();
    if (!name) return;
    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    const created = await createTag(name, color);
    if (created && task.id && created.id) {
      setAssignedIds((prev) => new Set(prev).add(created.id!));
      await assignTag(task.id, created.id!);
    }
    setSearch("");
  };

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Tags</h3>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-2 py-1.5 text-sm bg-transparent border border-border rounded-md outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />

              {allTags.length === 0 && !search && (
                <span className="block px-2 py-1.5 text-xs text-muted-foreground">
                  Loading...
                </span>
              )}

              {allTags.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleToggle(tag)}
                        className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="flex-1">{tag.name}</span>
                        <Checkbox
                          checked={isAssigned(tag.id!)}
                          className="h-4 w-4 pointer-events-none"
                        />
                      </button>
                    ))
                  ) : !showCreate ? (
                    <span className="block px-2 py-1.5 text-xs text-muted-foreground">
                      No matching tags
                    </span>
                  ) : null}
                </div>
              )}

              {showCreate && (
                <button
                  onClick={handleCreateAndAssign}
                  className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors text-primary border-t pt-2 mt-1"
                >
                  Create "{search}"
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
            <button
              onClick={() => handleToggle(tag)}
              className="ml-0.5 hover:opacity-70 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {displayTags.length === 0 && (
          <span className="text-xs text-muted-foreground">No tags</span>
        )}
      </div>
    </div>
  );
}
