import { useEffect, useState } from "react";
import { useTagStore } from "@/stores/tag_store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const TAG_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export default function FiltersTagsPage() {
  const {
    tags,
    fetchTags,
    createTag,
    deleteTag,
  } = useTagStore();
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);

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
    setSelectedColor(TAG_COLORS[0]);
  };

  const handleDelete = async (id: string) => {
    await deleteTag(id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Filters & Tags</h1>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Tags</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="space-y-3 mb-4"
        >
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name..."
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-transparent outline-none focus:ring-1 focus:ring-ring"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Color:</span>
            <div className="flex gap-1">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    selectedColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Create Tag
          </Button>
        </form>

        <div className="space-y-1">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No tags yet. Create one above.</p>
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
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <p className="text-sm text-muted-foreground">
          Advanced filters coming soon...
        </p>
      </div>
    </div>
  );
}
