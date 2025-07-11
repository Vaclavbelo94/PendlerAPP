
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Shift, ShiftType } from "./types";
import { cs, de, pl } from "date-fns/locale";
import { dateFromDBString } from "./utils/dateUtils";
import { useTranslation } from 'react-i18next';

interface ShiftCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: Shift[];
  onUpdateShift?: (id: string, updatedData: any) => void;
  onDeleteShift?: (id: string) => void;
}

export const ShiftCalendar = ({ 
  selectedDate, 
  onSelectDate, 
  shifts,
  onUpdateShift,
  onDeleteShift
}: ShiftCalendarProps) => {
  const { t, i18n } = useTranslation('shifts');

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

  const getCalendarModifiers = () => {
    if (!shifts.length) return {};
    
    const morningShifts = shifts
      .filter(shift => shift.type === "morning")
      .map(shift => dateFromDBString(shift.date));
    
    const afternoonShifts = shifts
      .filter(shift => shift.type === "afternoon")
      .map(shift => dateFromDBString(shift.date));
    
    const nightShifts = shifts
      .filter(shift => shift.type === "night")
      .map(shift => dateFromDBString(shift.date));
      
    return {
      morning: morningShifts,
      afternoon: afternoonShifts,
      night: nightShifts,
    };
  };
  
  const getCalendarModifiersStyles = () => {
    return {
      morning: { backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "bold" },
      afternoon: { backgroundColor: "#22c55e", color: "#ffffff", fontWeight: "bold" },
      night: { backgroundColor: "#8b5cf6", color: "#ffffff", fontWeight: "bold" }
    };
  };

  return (
    <div className="flex justify-center p-4 bg-card rounded-lg border">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="p-3 pointer-events-auto"
        locale={getDateLocale()}
        showOutsideDays
        modifiers={getCalendarModifiers()}
        modifiersStyles={getCalendarModifiersStyles()}
      />
    </div>
  );
};
