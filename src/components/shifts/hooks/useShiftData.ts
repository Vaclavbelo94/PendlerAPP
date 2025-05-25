
import { useState } from "react";
import { ShiftType, AnalyticsPeriod } from "../types";

export const useShiftData = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [shiftNotes, setShiftNotes] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsPeriod>("month");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return {
    selectedDate,
    setSelectedDate,
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
    setExportDialogOpen
  };
};
