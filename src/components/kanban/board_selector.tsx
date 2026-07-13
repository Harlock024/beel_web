import { useState } from "react";
import { useKanbanStore } from "@/stores/kanban_store";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const BOARD_COLORS = [
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-blue-600 to-indigo-900",
  "from-slate-400 to-slate-500",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
];

export function BoardSelector() {
  const { boards, selectBoard, createBoard } = useKanbanStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createBoard(newTitle.trim());
      setNewTitle("");
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My Boards</h2>
        {isCreating ? (
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Board name..."
              className="px-3 py-1.5 text-sm border rounded-md bg-background outline-none focus:ring-1 focus:ring-ring"
            />
            <Button type="submit" size="sm">
              Create
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false);
                setNewTitle("");
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Board
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <button
          onClick={() => setIsCreating(true)}
          className="group flex flex-col rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors aspect-[4/3]"
        >
          <div className="flex-1 flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="px-3 py-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors text-left">
            Create new board
          </div>
        </button>

        {boards.map((board, i) => (
          <button
            key={board.id}
            onClick={() => selectBoard(board.id)}
            className="group flex flex-col rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all text-left aspect-[4/3]"
          >
            <div
              className={`flex-1 bg-gradient-to-br ${BOARD_COLORS[i % BOARD_COLORS.length]}`}
            />
            <div className="px-3 py-2 bg-card text-card-foreground text-sm font-medium truncate group-hover:bg-accent transition-colors">
              {board.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
