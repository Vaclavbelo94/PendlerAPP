
import { toast } from "@/components/ui/use-toast";
import { Shift, ShiftType } from "../types";
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
      const updatedShifts = await loadUserShifts(user.id);
      setShifts(updatedShifts); // Now types match - both use string dates
      
      // Update localStorage backup
      localStorage.setItem("shifts", JSON.stringify(updatedShifts));
      
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
      await deleteShift(currentShift.id, user.id);
      
      // Update local state
      const updatedShifts = await loadUserShifts(user.id);
      setShifts(updatedShifts); // Now types match
      
      // Update localStorage backup
      localStorage.setItem("shifts", JSON.stringify(updatedShifts));
      
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
