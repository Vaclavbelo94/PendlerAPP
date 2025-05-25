
import { useShiftLoading } from "./useShiftLoading";
import { useShiftData } from "./useShiftData";
import { useCurrentShift } from "./useCurrentShift";
import { useShiftOperations } from "./useShiftOperations";

export const useRefactoredShiftManagement = (user: any) => {
  const { shifts, setShifts, isLoading } = useShiftLoading(user);
  const shiftData = useShiftData();
  
  const currentShift = useCurrentShift(
    shiftData.selectedDate, 
    shifts, 
    shiftData.setShiftType, 
    shiftData.setShiftNotes
  );

  const shiftOperations = useShiftOperations(
    user,
    shiftData.selectedDate,
    shiftData.shiftType,
    shiftData.shiftNotes,
    currentShift,
    setShifts,
    shiftData.setShiftType,
    shiftData.setShiftNotes
  );

  // Handle saving notes from dialog
  const handleSaveNotes = async (notes: string) => {
    shiftData.setShiftNotes(notes);
    
    // If there is a current shift, update it immediately
    if (currentShift) {
      await shiftOperations.handleSaveShift();
    }
  };

  return {
    ...shiftData,
    shifts,
    setShifts,
    currentShift,
    isLoading,
    handleSaveShift: shiftOperations.handleSaveShift,
    handleDeleteShift: shiftOperations.handleDeleteShift,
    handleSaveNotes
  };
};
