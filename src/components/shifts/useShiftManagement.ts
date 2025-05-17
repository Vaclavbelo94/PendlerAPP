
import { useState, useEffect } from "react";
import { Shift, ShiftType } from "./types";
import { toast } from "@/components/ui/use-toast";

export const useShiftManagement = (user: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [shiftNotes, setShiftNotes] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [analyticsPeriod, setAnalyticsPeriod] = useState<import("./types").AnalyticsPeriod>("month");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Load shifts from localStorage on component mount
  useEffect(() => {
    try {
      const savedShifts = localStorage.getItem("shifts");
      if (savedShifts) {
        setShifts(JSON.parse(savedShifts));
      }
    } catch (e) {
      console.error("Error loading shifts:", e);
    }
  }, []);
  
  // Save shifts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("shifts", JSON.stringify(shifts));
    } catch (e) {
      console.error("Error saving shifts:", e);
    }
  }, [shifts]);

  // Find current shift for the selected date
  const getCurrentShift = () => {
    if (!selectedDate) return null;
    
    return shifts.find(
      (shift) => new Date(shift.date).toDateString() === selectedDate.toDateString()
    );
  };
  
  const currentShift = getCurrentShift();
  
  // Set shiftType and notes when currentShift changes
  useEffect(() => {
    if (currentShift) {
      setShiftType(currentShift.type);
      setShiftNotes(currentShift.notes || "");
    } else {
      setShiftType("morning");
      setShiftNotes("");
    }
  }, [currentShift]);
  
  // Handle saving shift
  const handleSaveShift = () => {
    if (!selectedDate || !user) return;
    
    const newShift = {
      id: currentShift?.id || Date.now().toString(),
      date: selectedDate,
      type: shiftType,
      notes: shiftNotes.trim(),
      userId: user.id || user.email
    };
    
    let updatedShifts;
    
    if (currentShift) {
      // Update existing shift
      updatedShifts = shifts.map(
        (shift) => (shift.id === currentShift.id ? newShift : shift)
      );
      toast({
        title: "Směna aktualizována",
        description: `Směna byla úspěšně upravena.`,
      });
    } else {
      // Add new shift
      updatedShifts = [...shifts, newShift];
      toast({
        title: "Směna přidána",
        description: `Nová směna byla úspěšně přidána.`,
      });
    }
    
    setShifts(updatedShifts);
  };
  
  // Handle deleting shift
  const handleDeleteShift = () => {
    if (!currentShift) return;
    
    const updatedShifts = shifts.filter((shift) => shift.id !== currentShift.id);
    setShifts(updatedShifts);
    
    toast({
      title: "Směna odstraněna",
      description: `Směna byla úspěšně odstraněna.`,
      variant: "destructive"
    });
  };
  
  // Handle saving notes from dialog
  const handleSaveNotes = (notes: string) => {
    setShiftNotes(notes);
    // If there is a current shift, update it immediately
    if (currentShift) {
      handleSaveShift();
    }
    setNoteDialogOpen(false);
  };

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
    currentShift,
    handleSaveShift,
    handleDeleteShift,
    handleSaveNotes
  };
};
