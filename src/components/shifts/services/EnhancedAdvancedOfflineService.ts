
import { Shift, ShiftType } from '@/types/shifts';
import { supabase } from '@/integrations/supabase/client';

export class EnhancedAdvancedOfflineService {
  private shifts: Shift[] = [];
  
  async loadShifts(userId: string): Promise<Shift[]> {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      // Properly map and type the shifts data
      const formattedShifts: Shift[] = (data || []).map(shift => ({
        id: shift.id,
        user_id: shift.user_id,
        date: shift.date,
        type: shift.type as ShiftType,
        start_time: shift.start_time || '08:00',
        end_time: shift.end_time || '16:00',
        notes: shift.notes || '',
        created_at: shift.created_at,
        updated_at: shift.updated_at,
      }));

      this.shifts = formattedShifts;
      return formattedShifts;
    } catch (error) {
      console.error('Error loading shifts:', error);
      return this.shifts;
    }
  }

  async saveShift(shift: Partial<Shift>, userId: string): Promise<Shift> {
    try {
      // Ensure we have all required fields for database insertion
      const shiftData = {
        user_id: userId,
        date: shift.date!,
        type: shift.type!,
        start_time: shift.start_time || this.getDefaultStartTime(shift.type!),
        end_time: shift.end_time || this.getDefaultEndTime(shift.type!),
        notes: shift.notes || null,
      };

      let result;
      
      if (shift.id) {
        // Update existing shift
        const { data, error } = await supabase
          .from('shifts')
          .update(shiftData)
          .eq('id', shift.id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new shift
        const { data, error } = await supabase
          .from('shifts')
          .insert([shiftData])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Return properly typed shift
      return {
        ...result,
        type: result.type as ShiftType,
      };
    } catch (error) {
      console.error('Error saving shift:', error);
      throw error;
    }
  }

  private getDefaultStartTime(type: ShiftType): string {
    switch (type) {
      case 'morning': return '06:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      case 'custom': return '08:00';
      default: return '08:00';
    }
  }

  private getDefaultEndTime(type: ShiftType): string {
    switch (type) {
      case 'morning': return '14:00';
      case 'afternoon': return '22:00';
      case 'night': return '06:00';
      case 'custom': return '16:00';
      default: return '16:00';
    }
  }

  async deleteShift(shiftId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Update local cache
      this.shifts = this.shifts.filter(shift => shift.id !== shiftId);
    } catch (error) {
      console.error('Error deleting shift:', error);
      throw error;
    }
  }
}
