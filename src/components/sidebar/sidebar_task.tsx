import { cn } from "@/lib/utils";
import {
  ChevronsRight,
  ListChecks,
  Calendar,
  Clock,
  StickyNote,
  List,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { useFiltersStore, FilterType } from "@/stores/useFilterStore";
import { Button } from "../ui/button";

export function SidebarTask({ className }: { className: string }) {
  const { filterTasks } = useFiltersStore();
  const [selectedFilter, setSelectedFilter] = useState<FilterType | undefined>(
    "all",
  );

  const taskNav: {
    title: string;
    filter: FilterType;
    icon: React.ReactNode;
  }[] = [
    {
      title: "Today",
      icon: <List />,
      filter: "today",
    },
    {
      title: "Upcoming",
      icon: <ChevronsRight />,
      filter: "upcoming",
    },
  ];

  const handleFilterChange = (filter: FilterType) => {
    const newFilter = filter === selectedFilter ? filter : "all";
    setSelectedFilter(newFilter);
    filterTasks({ dateFilter: newFilter });
  };

  return (
    <div className={cn(className, "")}>
      <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
        tasks
      </h2>
      <div className="space-y-1   ">
        {taskNav.map((item) => (
          <Button
            variant={"ghost"}
            onClick={() => handleFilterChange(item.filter)}
            key={item.title}
            className={`flex items-center gap-3 px-2 py-2 rounded-sm w-full justify-start text-gray-700 hover:bg-gray-200  transition-colors ${
              selectedFilter === item.filter ? "bg-gray-300" : ""
            }`}
          >
            <span className="text-gray-600">{item.icon}</span>
            <span>{item.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
