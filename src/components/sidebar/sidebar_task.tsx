import { cn } from "@/lib/utils";
import { ChevronsRight, List } from "lucide-react";
import { useState } from "react";
import { FilterType, useFilterStore } from "@/stores/useFilterStore";

export function SidebarTask({ className }: { className?: string }) {
  const [selectedFilter, setSelectedFilter] = useState<
    FilterType | undefined
  >();
  const taskNav: {
    title: string;
    href: string;
    filter: FilterType;
    icon: React.ReactNode;
  }[] = [
    {
      title: "Today",
      icon: <List />,
      href: "/task/today",
      filter: "today",
    },
    {
      title: "Upcoming",
      icon: <ChevronsRight />,
      href: "/task/upcoming",
      filter: "upcoming",
    },
  ];
  const handleFilterChange = (filter: FilterType) => {
    const newFilter = filter === selectedFilter ? filter : undefined;
    setSelectedFilter(newFilter);
    useFilterStore.getState().filterTasks({ dateFilter: filter });
    console.log("Filter changed to:", filter);
  };

  return (
    <div className={cn(className, "")}>
      <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
        tasks
      </h2>
      <div className="space-y-1   ">
        {taskNav.map((item) => (
          <a
            href={item.href}
            onClick={() => handleFilterChange(item.filter)}
            key={item.title}
            className={`flex items-center gap-3 px-2 py-2 rounded-sm w-full justify-start text-gray-700 hover:bg-gray-200  transition-colors ${
              selectedFilter === item.filter ? "bg-gray-300" : ""
            }`}
          >
            <span className="text-gray-600">{item.icon}</span>
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
