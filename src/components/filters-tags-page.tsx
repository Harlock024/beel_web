import { useEffect, useState } from "react";
import { useTagStore } from "@/stores/tag_store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const TAG_COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#6b7280" },
];

export default function FiltersTagsPage() {
  const { tags, fetchTags, createTag, deleteTag } = useTagStore();
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].value);
  const [tagsOpen, setTagsOpen] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async () => {
    const name = newTagName.trim();
    if (!name) return;
    if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Tag already exists");
      return;
    }
    await createTag(name, selectedColor);
    setNewTagName("");
    setSelectedColor(TAG_COLORS[0].value);
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteTag(id);
  };

  const selectedColorName =
    TAG_COLORS.find((c) => c.value === selectedColor)?.name || "Select color";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Filters & Tags</h1>

      <Collapsible open={tagsOpen} onOpenChange={setTagsOpen}>
        <div className="flex items-center justify-between mb-2">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-lg font-medium hover:text-foreground/80 transition-colors">
              <ChevronRight
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  tagsOpen && "rotate-90"
                )}
              />
              Tags
              <span className="text-sm text-muted-foreground font-normal">
                ({tags.length})
              </span>
            </button>
          </CollapsibleTrigger>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <CollapsibleContent>
          <div className="space-y-1 ml-7">
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No tags yet. Click + to create one.
              </p>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent/50 group"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-sm">{tag.name}</span>
                  <button
                    onClick={() => handleDelete(tag.id!)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to organize your tasks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name..."
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-transparent outline-none focus:ring-1 focus:ring-ring"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <Select
                value={selectedColor}
                onValueChange={(value) => setSelectedColor(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedColorName} />
                </SelectTrigger>
                <SelectContent>
                  {TAG_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newTagName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <p className="text-sm text-muted-foreground">
          Advanced filters coming soon...
        </p>
      </div>
    </div>
  );
}
