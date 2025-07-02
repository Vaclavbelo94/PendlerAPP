
import { toast } from "@/hooks/use-toast";
import { Shift, ShiftType } from "@/types/shifts";
import { loadUserShifts, saveShift, deleteShift } from "../services/shiftService";

export const useShiftOperations = (
  user: any,
  selectedDate: Date | undefined,
  shiftType: ShiftType,
  shiftNotes: string,
  currentShift: Shift | null,
  setShifts: (shifts: Shift[]) => void,
  setShiftType: (type: ShiftType) => void,
  setShiftNotes: (notes: string) => void
) => {
  // Helper functions for default times
  const getDefaultStartTime = (type: string): string => {
    switch (type) {
      case 'morning': return '06:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      case 'custom': return '08:00';
      default: return '08:00';
    }
  };

  const getDefaultEndTime = (type: string): string => {
    switch (type) {
      case 'morning': return '14:00';
      case 'afternoon': return '22:00';  
      case 'night': return '06:00';
      case 'custom': return '16:00';
      default: return '16:00';
    }
  };

  // Handle saving shift
  const handleSaveShift = async () => {
    if (!selectedDate || !user) {
      toast({
        title: "Chyba",
        description: "Pro uložení směny musíte být přihlášeni a vybrat datum.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { savedShift, isUpdate } = await saveShift(selectedDate, shiftType, shiftNotes, user.id);
      
      toast({
        title: isUpdate ? "Směna aktualizována" : "Směna přidána",
        description: `Směna byla úspěšně ${isUpdate ? "upravena" : "přidána"}.`,
      });
      
      // Reload all shifts to ensure consistency
      const rawShifts = await loadUserShifts(user.id);
      
      // Transform raw shift data to proper Shift interface
      const typedShifts: Shift[] = rawShifts.map(shift => ({
        id: shift.id,
        user_id: shift.userId || shift.user_id || user.id,
        date: shift.date,
        type: shift.type,
        start_time: shift.start_time || getDefaultStartTime(shift.type),
        end_time: shift.end_time || getDefaultEndTime(shift.type),
        notes: shift.notes || '',
        created_at: shift.created_at || new Date().toISOString(),
        updated_at: shift.updated_at || new Date().toISOString(),
      }));
      
      setShifts(typedShifts);
      
      // Update localStorage backup
      localStorage.setItem("shifts", JSON.stringify(typedShifts));
      
    } catch (error) {
      console.error("Error saving shift:", error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit směnu. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  };
  
  // Handle deleting shift
  const handleDeleteShift = async () => {
    if (!currentShift || !user) return;
    
    try {
      await deleteShift(currentShift.id!, user.id);
      
      // Update local state
      const rawShifts = await loadUserShifts(user.id);
      
      // Transform raw shift data to proper Shift interface
      const typedShifts: Shift[] = rawShifts.map(shift => ({
        id: shift.id,
        user_id: shift.userId || shift.user_id || user.id,
        date: shift.date,
        type: shift.type,
        start_time: shift.start_time || getDefaultStartTime(shift.type),
        end_time: shift.end_time || getDefaultEndTime(shift.type),
        notes: shift.notes || '',
        created_at: shift.created_at || new Date().toISOString(),
        updated_at: shift.updated_at || new Date().toISOString(),
      }));
      
      setShifts(typedShifts);
      
      // Update localStorage backup
      localStorage.setItem("shifts", JSON.stringify(typedShifts));
      
      // Reset form
      setShiftType("morning");
      setShiftNotes("");
      
      toast({
        title: "Směna odstraněna",
        description: `Směna byla úspěšně odstraněna.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se odstranit směnu. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  };
  
  // Handle saving notes from dialog
  const handleSaveNotes = async (notes: string) => {
    setShiftNotes(notes);
    
    // If there is a current shift, update it immediately
    if (currentShift) {
      await handleSaveShift();
    }
  };

  return {
    handleSaveShift,
    handleDeleteShift,
    handleSaveNotes
  };
};
