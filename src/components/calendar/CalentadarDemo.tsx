import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/task";

interface CalendarDemoProps {
  selectedDate?: Date;
  onDataChange?: (date: Date | undefined) => void;
}
export function CalendarDemo({
  selectedDate,
  onDataChange,
}: CalendarDemoProps) {
  const handleSelect = (date: Date | undefined) => {
    if (onDataChange) {
      onDataChange(date);
    }
  };
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      className="rounded-md border shadow"
    />
  );
}
