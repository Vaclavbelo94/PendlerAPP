import { supabase } from "@/integrations/supabase/client";
import { ShiftType } from "../types";
import { formatDateForDB } from "../utils/dateUtils";

export interface ShiftData {
  date: string;
  type: ShiftType;
  notes: string;
  user_id: string;
}

/**
 * Load all shifts for a user from Supabase
 */
export const loadUserShifts = async (userId: string) => {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  return data?.map(shift => ({
    id: shift.id,
    date: new Date(shift.date),
    type: shift.type as ShiftType,
    notes: shift.notes || "",
    userId: shift.user_id
  })) || [];
};

/**
 * Save or update a shift in the database
 */
export const saveShift = async (
  selectedDate: Date, 
  shiftType: ShiftType, 
  shiftNotes: string, 
  userId: string
) => {
  const formattedDate = formatDateForDB(selectedDate);
  console.log("Saving shift for date:", formattedDate, "from selected date:", selectedDate);
  
  const shiftData: ShiftData = {
    date: formattedDate,
    type: shiftType,
    notes: shiftNotes.trim(),
    user_id: userId
  };
  
  // First, check for existing shifts for this date and user
  const { data: existingShifts, error: checkError } = await supabase
    .from('shifts')
    .select('*')
    .eq('user_id', userId)
    .eq('date', formattedDate);
    
  if (checkError) throw checkError;
  
  // If there are multiple shifts for the same date, delete all but keep the first one
  if (existingShifts && existingShifts.length > 1) {
    console.log(`Found ${existingShifts.length} duplicate shifts, cleaning up...`);
    
    // Keep the first shift, delete the rest
    const shiftsToDelete = existingShifts.slice(1);
    for (const shift of shiftsToDelete) {
      await supabase
        .from('shifts')
        .delete()
        .eq('id', shift.id)
        .eq('user_id', userId);
    }
  }
  
  let savedShift;
  let isUpdate = false;
  
  if (existingShifts && existingShifts.length > 0) {
    // Update the existing shift (using the first one after cleanup)
    const shiftToUpdate = existingShifts[0];
    const { data, error } = await supabase
      .from('shifts')
      .update({
        type: shiftType,
        notes: shiftNotes.trim()
      })
      .eq('id', shiftToUpdate.id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    savedShift = data;
    isUpdate = true;
  } else {
    // Create new shift
    const { data, error } = await supabase
      .from('shifts')
      .insert(shiftData)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    savedShift = data;
  }
  
  return { savedShift, isUpdate };
};

/**
 * Delete a shift from the database
 */
export const deleteShift = async (shiftId: string, userId: string) => {
  const { error } = await supabase
    .from('shifts')
    .delete()
    .eq('id', shiftId)
    .eq('user_id', userId);
    
  if (error) throw error;
};
