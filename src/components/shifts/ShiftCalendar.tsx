
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Shift, ShiftType } from "./types";
import { cs } from "date-fns/locale";

interface ShiftCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: Shift[];
}

export const ShiftCalendar = ({ 
  selectedDate, 
  onSelectDate, 
  shifts 
}: ShiftCalendarProps) => {
  // Gets modifiers for the calendar to highlight days with shifts
  const getCalendarModifiers = () => {
    if (!shifts.length) return {};
    
    const morningShifts = shifts
      .filter(shift => shift.type === "morning")
      .map(shift => new Date(shift.date));
    
    const afternoonShifts = shifts
      .filter(shift => shift.type === "afternoon")
      .map(shift => new Date(shift.date));
    
    const nightShifts = shifts
      .filter(shift => shift.type === "night")
      .map(shift => new Date(shift.date));
      
    return {
      morning: morningShifts,
      afternoon: afternoonShifts,
      night: nightShifts,
    };
  };
  
  // Gets styles for different shift types in the calendar
  const getCalendarModifiersStyles = () => {
    return {
      morning: { backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "bold" },
      afternoon: { backgroundColor: "#22c55e", color: "#ffffff", fontWeight: "bold" },
      night: { backgroundColor: "#8b5cf6", color: "#ffffff", fontWeight: "bold" }
    };
  };

  return (
    <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="p-3 pointer-events-auto"
        locale={cs}
        showOutsideDays
        modifiers={getCalendarModifiers()}
        modifiersStyles={getCalendarModifiersStyles()}
      />
    </div>
  );
};
