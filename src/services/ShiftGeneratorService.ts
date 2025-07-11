import { supabase } from "@/integrations/supabase/client";
import { WocheCalculatorService } from "./WocheCalculatorService";
import { DHLShift } from "@/types/dhl";

export interface GeneratedShift {
  id?: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  dhl_position_id?: string;
  dhl_work_group_id?: string;
  is_dhl_managed: boolean;
  dhl_override?: boolean;
  original_dhl_data?: any;
}

export class ShiftGeneratorService {
  /**
   * Generate shifts for a user for a specific date range
   */
  static async generateShiftsForDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<GeneratedShift[]> {
    const generatedShifts: GeneratedShift[] = [];
    
    // Get user's DHL assignment
    const { data: assignment } = await supabase
      .from('user_dhl_assignments')
      .select('dhl_position_id, current_woche, reference_date')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (!assignment) {
      console.log('No DHL assignment found for user');
      return [];
    }

    // Iterate through each date in the range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const shift = await this.generateShiftForDate(userId, new Date(currentDate), assignment);
      if (shift) {
        generatedShifts.push(shift);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return generatedShifts;
  }

  /**
   * Generate a shift for a specific date
   */
  static async generateShiftForDate(
    userId: string,
    date: Date,
    assignment?: any
  ): Promise<GeneratedShift | null> {
    // Get user assignment if not provided
    if (!assignment) {
      const { data } = await supabase
        .from('user_dhl_assignments')
        .select('dhl_position_id, current_woche, reference_date')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
      
      if (!data) return null;
      assignment = data;
    }

    // Calculate user's Woche for this date
    const wocheResult = await WocheCalculatorService.calculateUserWocheForDate(userId, date);
    if (!wocheResult) {
      console.log('Could not calculate Woche for date:', date);
      return null;
    }

    // Get calendar week for this date
    const kw = WocheCalculatorService.getCalendarWeek(date);
    const formattedKW = `KW${kw.toString().padStart(2, '0')}`;

    // Find shift schedule for this KW, Woche, and position
    const { data: schedule } = await supabase
      .from('dhl_shift_schedules')
      .select('schedule_data')
      .eq('calendar_week', kw)
      .eq('woche_group', wocheResult.rotatedWoche)
      .eq('position_id', assignment.dhl_position_id)
      .eq('is_active', true)
      .single();

    if (!schedule || !schedule.schedule_data) {
      console.log(`No schedule found for KW${kw}, Woche ${wocheResult.rotatedWoche}, Position ${assignment.dhl_position_id}`);
      return null;
    }

    // Extract shift data for this specific date
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Find shift data for this day
    const scheduleData = schedule.schedule_data as any;
    if (!scheduleData.shifts) {
      console.log('No shifts data in schedule');
      return null;
    }

    const dayShift = scheduleData.shifts.find((shift: any) => 
      shift.date === dateStr || 
      this.matchesDayOfWeek(shift.day, dayOfWeek)
    );

    if (!dayShift || dayShift.shiftType === 'OFF') {
      console.log('No shift or day off for this date');
      return null;
    }

    // Convert DHL shift type to app shift type
    const shiftType = this.convertDHLShiftType(dayShift.shiftType);
    
    return {
      user_id: userId,
      date: dateStr,
      start_time: dayShift.startTime || this.getDefaultStartTime(shiftType),
      end_time: dayShift.endTime || this.getDefaultEndTime(shiftType),
      type: shiftType,
      dhl_position_id: assignment.dhl_position_id,
      is_dhl_managed: true,
      original_dhl_data: {
        kw: formattedKW,
        woche: wocheResult.rotatedWoche,
        shiftType: dayShift.shiftType
      }
    };
  }

  /**
   * Check if shift day matches day of week
   */
  private static matchesDayOfWeek(shiftDay: string, dayOfWeek: number): boolean {
    const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    return shiftDay === dayNames[dayOfWeek];
  }

  /**
   * Convert DHL shift type to app shift type
   */
  private static convertDHLShiftType(dhlType: string): 'morning' | 'afternoon' | 'night' {
    switch (dhlType) {
      case 'R': return 'morning';
      case 'O': return 'afternoon';
      case 'N': return 'night';
      default: return 'morning';
    }
  }

  /**
   * Get default start time for shift type
   */
  private static getDefaultStartTime(type: 'morning' | 'afternoon' | 'night'): string {
    switch (type) {
      case 'morning': return '06:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      default: return '06:00';
    }
  }

  /**
   * Get default end time for shift type
   */
  private static getDefaultEndTime(type: 'morning' | 'afternoon' | 'night'): string {
    switch (type) {
      case 'morning': return '14:00';
      case 'afternoon': return '22:00';
      case 'night': return '06:00';
      default: return '14:00';
    }
  }

  /**
   * Save generated shifts to database
   */
  static async saveShifts(shifts: GeneratedShift[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shifts')
        .insert(shifts.map(shift => ({
          user_id: shift.user_id,
          date: shift.date,
          start_time: shift.start_time,
          end_time: shift.end_time,
          type: shift.type,
          notes: shift.notes,
          dhl_position_id: shift.dhl_position_id,
          dhl_work_group_id: shift.dhl_work_group_id,
          is_dhl_managed: shift.is_dhl_managed,
          dhl_override: shift.dhl_override,
          original_dhl_data: shift.original_dhl_data
        })));

      if (error) {
        console.error('Error saving shifts:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveShifts:', error);
      return false;
    }
  }
}