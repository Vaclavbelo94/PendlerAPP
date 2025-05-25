
import { useState } from "react";
import { Shift, ShiftType, AnalyticsPeriod } from "../types";

export const useShiftState = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [shiftNotes, setShiftNotes] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsPeriod>("month");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return {
    selectedDate,
    setSelectedDate,
    shifts,
    setShifts,
    shiftType,
    setShiftType,
    shiftNotes,
    setShiftNotes,
    selectedMonth,
    setSelectedMonth,
    analyticsPeriod,
    setAnalyticsPeriod,
    noteDialogOpen,
    setNoteDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    isLoading,
    setIsLoading
  };
};
