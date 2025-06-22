import { useEffect } from "react";
import { useListStore } from "@/stores/list_store";

export function TitleListUpdater() {
  const title = useListStore((state) => state.selectedTitleList);

  useEffect(() => {
    document.title = title ? title : "";
  }, [title]);

  return null;
}
