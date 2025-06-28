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
    <aside className={cn("w-auto px-1 py-1", className)}>
  
      <div className="flex flex-col gap-1 w-full">
        {taskNav.map((item) => (
          <a
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item);
            }}
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md w-full justify-start text-[14px] transition-all duration-200",
              selectedNavId === item.id
                ? "bg-[#ececec] text-gray-900 font-medium"
                : "text-gray-700 hover:bg-[#ececec]"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 transition-colors",
                selectedNavId === item.id ? "text-gray-900" : "text-gray-500"
              )}
            >
              {item.icon}
            </span>
            <span className="select-none">{item.title}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
