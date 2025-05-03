import { List } from "@/types/list";
import { Label } from "../ui/label";
import { useListStore } from "@/stores/list_store";

export function ListCard({
  list,
  selectedListId,
  handleListClick,
}: {
  list: List;
  selectedListId: string;
  handleListClick: (listId: string) => void;
}) {
  return (
    <button
      key={list.id}
      onClick={() => handleListClick(list.id)}
      className={`w-full flex items-center gap-2 text-sm px-3 py-2 rounded transition-colors
        ${
          selectedListId === list.id
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <div
        className="size-2 rounded-full"
        style={{ backgroundColor: list.color }}
      ></div>
      <span className="truncate">{list.title}</span>
    </button>
  );
}
