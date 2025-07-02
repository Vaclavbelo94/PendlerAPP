
import { supabase } from '@/integrations/supabase/client';
import { ShiftType } from '@/types/shifts';

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

export const loadUserShifts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Raw shifts from database:', data);
    return data || [];
  } catch (error) {
    console.error('Error loading shifts:', error);
    throw error;
  }
};

export const saveShift = async (
  date: Date, 
  type: ShiftType, 
  notes: string, 
  userId: string
): Promise<{ savedShift: any; isUpdate: boolean }> => {
  try {
    const dateStr = date.toISOString().split('T')[0];
    
    console.log('Saving shift:', { date: dateStr, type, notes, userId });

    // Check if shift already exists for this date
    const { data: existingShifts, error: checkError } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr);

    if (checkError) {
      console.error('Error checking existing shifts:', checkError);
      throw checkError;
    }

    const shiftData = {
      user_id: userId,
      date: dateStr,
      type: type,
      start_time: getDefaultStartTime(type),
      end_time: getDefaultEndTime(type),
      notes: notes || null,
    };

    if (existingShifts && existingShifts.length > 0) {
      // Update existing shift
      const existingShift = existingShifts[0];
      const { data, error } = await supabase
        .from('shifts')
        .update(shiftData)
        .eq('id', existingShift.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating shift:', error);
        throw error;
      }

      console.log('Updated shift:', data);
      return { savedShift: data, isUpdate: true };
    } else {
      // Create new shift
      const { data, error } = await supabase
        .from('shifts')
        .insert([shiftData])
        .select()
        .single();

      if (error) {
        console.error('Error creating shift:', error);
        throw error;
      }

      console.log('Created shift:', data);
      return { savedShift: data, isUpdate: false };
    }
  } catch (error) {
    console.error('Error in saveShift:', error);
    throw error;
  }
};

export const deleteShift = async (shiftId: string, userId: string) => {
  try {
    console.log('Deleting shift:', shiftId, 'for user:', userId);
    
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', shiftId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting shift:', error);
      throw error;
    }

    console.log('Shift deleted successfully');
  } catch (error) {
    console.error('Error in deleteShift:', error);
    throw error;
  }
};
