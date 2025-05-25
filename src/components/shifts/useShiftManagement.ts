
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { loadUserShifts } from "./services/shiftService";
import { useShiftState } from "./hooks/useShiftState";
import { useCurrentShift } from "./hooks/useCurrentShift";
import { useShiftOperations } from "./hooks/useShiftOperations";

export const useShiftManagement = (user: any) => {
  const {
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
  } = useShiftState();

  const currentShift = useCurrentShift(selectedDate, shifts, setShiftType, setShiftNotes);

  const { handleSaveShift, handleDeleteShift, handleSaveNotes } = useShiftOperations(
    user,
    selectedDate,
    shiftType,
    shiftNotes,
    currentShift,
    setShifts,
    setShiftType,
    setShiftNotes
  );

  // Load shifts from Supabase when user is available
  useEffect(() => {
    const loadShifts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const formattedShifts = await loadUserShifts(user.id);
        setShifts(formattedShifts);
        
        // Also save to localStorage as backup
        localStorage.setItem("shifts", JSON.stringify(formattedShifts));
      } catch (error) {
        console.error("Error loading shifts:", error);
        // Fallback to localStorage if Supabase fails
        try {
          const savedShifts = localStorage.getItem("shifts");
          if (savedShifts) {
            const parsedShifts = JSON.parse(savedShifts).map((shift: any) => ({
              ...shift,
              date: new Date(shift.date)
            }));
            setShifts(parsedShifts);
          }
        } catch (e) {
          console.error("Error loading shifts from localStorage:", e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadShifts();
    }
  }, [user, setShifts, setIsLoading]);

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
    handleSaveNotes,
    isLoading
  };
};
