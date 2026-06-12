import { useEffect, useState, useRef } from "react";
import { Task } from "@/types/task";
import { Tag } from "@/types/tag";
import { Subtask } from "@/types/subTask";
import { useTaskStore } from "@/stores/task_store";
import { useTagStore } from "@/stores/tag_store";
import { FetchSubtasks } from "@/services/subtask_services";
import { Check, Expand, Minimize, Plus, Trash2, X } from "lucide-react";
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
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";

type TaskDetailsProps = {
  className?: string;
};

export function TaskDetails({ className }: TaskDetailsProps) {
  const { updateTask, removeTask, closeTask, task } = useTaskStore();
  const { lists } = useListStore();
  const { setIsOpen: setSidebarOpen } = useSidebarStore();
  const [currentTask, setCurrentTask] = useState<Task | undefined>(task);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(400);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = sidebarRef.current?.offsetWidth || 400;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const resize = (e: MouseEvent) => {
      if (!sidebarRef.current) return;

      const newWidth = Math.min(
        Math.max(startWidth + (startX - e.clientX), 300),
        window.innerWidth * 0.8,
      );

      sidebarRef.current.style.width = `${newWidth}px`;
      widthRef.current = newWidth;
    };

    const stopResizing = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
      setIsResizing(false);

      const finalWidth = widthRef.current;
      if (finalWidth > window.innerWidth / 2) {
        setIsOverlay(true);
        setSidebarOpen(false);
      } else {
        setIsOverlay(false);
        setSidebarOpen(true);
      }
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  useEffect(() => {
    setCurrentTask(task);
    setIsFullScreen(false);
    setIsOverlay(false);
    setSidebarOpen(true);
    if (task && sidebarRef.current) {
      sidebarRef.current.style.width = `${widthRef.current}px`;
    }
  }, [task]);

  const handleClose = () => {
    setIsFullScreen(false);
    setIsOverlay(false);
    setSidebarOpen(true);
    closeTask();
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => {
      const next = !prev;
      if (next) {
        setSidebarOpen(false);
        setIsOverlay(true);
      } else {
        setSidebarOpen(true);
        setIsOverlay(false);
        if (sidebarRef.current) {
          sidebarRef.current.style.width = `${widthRef.current}px`;
        }
      }
      return next;
    });
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebarRef.current) return;

      const target = event.target as HTMLElement;

      const isClickInsideSidebar = sidebarRef.current.contains(target);

      const isSelectContent = !!target.closest(
        [
          "[data-radix-select-content]",
          "[data-radix-select-trigger-content",
          ["data-radix-select-value"],
        ].join(", "),
      );
      const isPopoverContent = !!target.closest(
        "[data-radix-popper-content-wrapper]",
      );
      const isAnyRadixPortal = !!target.closest("[data-radix-portal]");

      if (
        isClickInsideSidebar ||
        isSelectContent ||
        isPopoverContent ||
        isAnyRadixPortal
      ) {
        return;
      }

      closeTask();
    };

    if (task) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [task, closeTask]);

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
  return (
    <div>
      {task && isFullScreen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div
            className="bg-card rounded-lg shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <TaskDetailsHeader
                task={currentTask}
                onClose={handleClose}
                isFullScreen={isFullScreen}
                onExpand={toggleFullScreen}
                onUpdateTitle={(title) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, title } : undefined,
                  )
                }
              />

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
                className="flex-1 overflow-y-auto px-6 py-4"
              >
                <textarea
                  className="w-full bg-transparent outline-none resize-none min-h-[200px] text-sm placeholder:text-muted-foreground border-muted-foreground focus:border-primary transition-all"
                  value={currentTask?.description || ""}
                  onChange={(e) =>
                    setCurrentTask((prev) =>
                      prev ? { ...prev, description: e.target.value } : undefined,
                    )
                  }
                  placeholder="Write something about this task..."
                />
              </form>

              {currentTask?.id && !currentTask.id.startsWith("temp-") && (
                <SubtaskSection task={currentTask} />
              )}

              {currentTask?.id && !currentTask.id.startsWith("temp-") && (
                <TagSection task={currentTask} />
              )}

              <TaskDetailsFooter
                hasChanges={hasTaskChanged()}
                isSaving={isSaving}
                onSave={handleEditTask}
                onRemove={handleRemoveTask}
              />
            </div>
          </div>
        </div>
      )}

      {task && !isFullScreen && (
        <div
          ref={sidebarRef}
          className={cn(
            "top-0 h-screen z-50 bg-card shadow-lg border-l",
            isResizing ? "" : "transition-all duration-300",
            isOverlay ? "fixed right-0" : "absolute right-0",
            className,
          )}
          style={{ width: `${widthRef.current}px` }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary/30 z-10"
            onMouseDown={startResizing}
          ></div>
          <div className="flex flex-col h-full">
            <TaskDetailsHeader
              task={currentTask}
              onClose={handleClose}
              isFullScreen={isFullScreen}
              onExpand={toggleFullScreen}
              onUpdateTitle={(title) =>
                setCurrentTask((prev) =>
                  prev ? { ...prev, title } : undefined,
                )
              }
            />

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
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              <textarea
                className="w-full bg-transparent outline-none resize-none min-h-[200px] text-sm placeholder:text-muted-foreground border-muted-foreground focus:border-primary transition-all"
                value={currentTask?.description || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, description: e.target.value } : undefined,
                  )
                }
                placeholder="Write something about this task..."
              />
            </form>

            {currentTask?.id && !currentTask.id.startsWith("temp-") && (
              <SubtaskSection task={currentTask} />
            )}

            {currentTask?.id && !currentTask.id.startsWith("temp-") && (
              <TagSection task={currentTask} />
            )}

            <TaskDetailsFooter
              hasChanges={hasTaskChanged()}
              isSaving={isSaving}
              onSave={handleEditTask}
              onRemove={handleRemoveTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TaskDetailsHeader({
  task,
  onUpdateTitle,
  onClose,
  onExpand,
  isFullScreen,
}: {
  task: Task | undefined;
  onUpdateTitle: (title: string) => void;
  onClose: () => void;
  onExpand?: () => void;
  isFullScreen?: boolean;
}) {
  return (
    <div className="px-6 py-4">
      <div className="flex  items-center  mb-4">
        <div className="flex  w-full items-star justify-between  gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onExpand}
          >
            {isFullScreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Expand className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <input
        type="text"
        value={task?.title || ""}
        onChange={(e) => onUpdateTitle(e.target.value)}
        placeholder="Task name"
        className="text-2xl font-semibold w-full bg-transparent outline-none border-none
                   focus:ring-0 border-b border-transparent focus:border-primary transition-all"
      />
    </div>
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

  const completedCount = subtasks.filter((s) => s.done).length;

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    addSubtask(task.id!, title);
    setNewTitle("");
    fetchSubtasks();
  };

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">
          Subtasks
          {subtasks.length > 0 && (
            <span className="ml-2 text-muted-foreground">
              {completedCount}/{subtasks.length}
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-1">
        {loading && subtasks.length === 0 ? (
          <span className="text-xs text-muted-foreground">Loading...</span>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent/50 group"
            >
              <Checkbox
                checked={subtask.done}
                onCheckedChange={() => {
                  toggleSubtask(task.id!, subtask.id);
                  fetchSubtasks();
                }}
                className="h-4 w-4"
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  subtask.done && "line-through text-muted-foreground",
                )}
              >
                {subtask.title}
              </span>
              <button
                onClick={() => {
                  removeSubtask(task.id!, subtask.id);
                  fetchSubtasks();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
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
    </div>
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
