
import { useEffect } from "react";
import { Shift, ShiftType } from "../types";

export const useCurrentShift = (
  selectedDate: Date | undefined,
  shifts: Shift[],
  setShiftType: (type: ShiftType) => void,
  setShiftNotes: (notes: string) => void
) => {
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
  }, [currentShift, setShiftType, setShiftNotes]);

  return currentShift;
};
