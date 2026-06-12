import { useEffect, useState } from "react";
import { useTagStore } from "@/stores/tag_store";
import { Button } from "../ui/button";
import { ArrowLeft, Pencil, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Props = {
  onClose: () => void;
};

export function SidebarFiltersTags({ onClose }: Props) {
  const {
    tags,
    fetchTags,
    createTag,
    deleteTag,
  } = useTagStore();
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

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
    await createTag(name);
    setNewTagName("");
  };

  const handleDelete = async (id: string) => {
    await deleteTag(id);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold">Filters & Tags</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Tags
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="flex items-center gap-2 mb-3"
          >
            <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>

          <div className="space-y-1">
            {tags.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No tags yet</p>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent/50 group"
                >
                  {editingId === tag.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none border-b border-ring"
                      autoFocus
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingId(null);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                  ) : (
                    <span className="flex-1 text-sm">{tag.name}</span>
                  )}
                  <button
                    onClick={() => handleDelete(tag.id!)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Filters
          </h3>
          <p className="text-xs text-muted-foreground">
            Advanced filters coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
