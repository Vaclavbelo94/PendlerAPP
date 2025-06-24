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
 * Now utilizes optimized database indexes
 */
export const loadUserShifts = async (userId: string) => {
  try {
    console.log("=== DEBUG: loadUserShifts START ===");
    console.log("Requested userId:", userId);
    
    // Debug: Check current auth status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("Current session:", session);
    console.log("Session error:", sessionError);
    console.log("Session user ID:", session?.user?.id);
    console.log("Auth UID match check:", session?.user?.id === userId);
    
    // Debug: Try to get current user ID from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("Current auth user:", user);
    console.log("User error:", userError);
    console.log("Auth user ID:", user?.id);

    // This query now benefits from idx_shifts_user_date index
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    console.log("Database query result:");
    console.log("- Data:", data);
    console.log("- Error:", error);
    console.log("- Data length:", data?.length || 0);
    
    // Debug: Let's also try to fetch ALL shifts to see what's in the database
    const { data: allShifts, error: allError } = await supabase
      .from('shifts')
      .select('*')
      .order('date', { ascending: false });
      
    console.log("ALL shifts in database:");
    console.log("- All data:", allShifts);
    console.log("- All error:", allError);
    console.log("- All data length:", allShifts?.length || 0);
    
    if (allShifts) {
      allShifts.forEach((shift, index) => {
        console.log(`Shift ${index + 1}:`, {
          id: shift.id,
          user_id: shift.user_id,
          date: shift.date,
          type: shift.type,
          user_id_matches: shift.user_id === userId
        });
      });
    }

    console.log("=== DEBUG: loadUserShifts END ===");

    if (error) throw error;

    return data?.map(shift => ({
      id: shift.id,
      date: shift.date, // Ponecháváme jako string pro konzistenci s databází
      type: shift.type as ShiftType,
      notes: shift.notes || "",
      userId: shift.user_id
    })) || [];
  } catch (error) {
    console.error("Error in loadUserShifts:", error);
    throw error;
  }
};

/**
 * Save or update a shift in the database
 * Now with enhanced validation thanks to SQL constraints
 */
export const saveShift = async (
  selectedDate: Date, 
  shiftType: ShiftType, 
  shiftNotes: string, 
  userId: string
) => {
  const formattedDate = formatDateForDB(selectedDate);
  console.log("Saving shift for date:", formattedDate, "from selected date:", selectedDate);
  
  // Validate shift type on client side (backup to SQL constraint)
  if (!['morning', 'afternoon', 'night'].includes(shiftType)) {
    throw new Error(`Invalid shift type: ${shiftType}`);
  }
  
  const shiftData: ShiftData = {
    date: formattedDate,
    type: shiftType,
    notes: shiftNotes.trim(),
    user_id: userId
  };
  
  // First, check for existing shifts for this date and user
  // This query benefits from idx_shifts_user_date index
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
    // Create new shift - SQL constraints will validate data
    const { data, error } = await supabase
      .from('shifts')
      .insert(shiftData)
      .select()
      .maybeSingle();
      
    if (error) {
      // Enhanced error handling for constraint violations
      if (error.code === '23514') { // Check constraint violation
        if (error.message.includes('check_shift_type')) {
          throw new Error(`Neplatný typ směny: ${shiftType}`);
        }
        if (error.message.includes('check_shift_date')) {
          throw new Error(`Neplatné datum směny: ${formattedDate}`);
        }
      }
      throw error;
    }
    savedShift = data;
  }
  
  return { savedShift, isUpdate };
};

/**
 * Delete a shift from the database
 * RLS policy ensures users can only delete their own shifts
 */
export const deleteShift = async (shiftId: string, userId: string) => {
  const { error } = await supabase
    .from('shifts')
    .delete()
    .eq('id', shiftId)
    .eq('user_id', userId); // RLS will also enforce this, but explicit is better
    
  if (error) throw error;
};
