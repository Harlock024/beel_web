import { cn } from "@/lib/utils";
import { ChevronsRight, List, Home } from "lucide-react";
import { useState } from "react";
import { FilterType, useFilterStore } from "@/stores/useFilterStore";

export function SidebarTask({ className }: { className?: string }) {
  const [selectedNavId, setSelectedNavId] = useState<string>("home");

  const taskNav = [
    {
      id: "home",
      title: "Home",
      icon: <Home size={18} />,
      href: "/home",
    },
    {
      id: "today",
      title: "Today",
      icon: <List size={18} />,
      href: "/task/today",
      filter: "today" as FilterType,
    },
    {
      id: "upcoming",
      title: "Upcoming",
      icon: <ChevronsRight size={18} />,
      href: "/task/upcoming",
      filter: "upcoming" as FilterType,
    },
  ];

  const handleNavClick = (navItem: typeof taskNav[0]) => {
    setSelectedNavId(navItem.id);
    useFilterStore.getState().filterTasks({
      dateFilter: navItem.filter,
    });
  };

  return (
    <div className={cn(className, "")}>
      <div className="flex flex-col gap-2">
        {taskNav.map((item) => (
          <a
            href={item.href}
            onClick={(e) => {
              handleNavClick(item);
            }}
            key={item.id}
            className={cn(
              "  flex items-center gap-3 px-3 py-2 rounded-md w-full justify-start text-gray-700 hover:bg-gray-200 transition-colors",
              selectedNavId === item.id ? "bg-gray-200 font-medium" : ""
            )}
          >
            <span className="text-gray-600">{item.icon}</span>
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
