import { supabase } from "@/integrations/supabase/client";
import { WocheCalculatorService } from "./WocheCalculatorService";
import { calculateSimpleWoche, getWocheForDate } from "@/utils/dhl/simpleWocheCalculator";

export interface UnifiedGeneratedShift {
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
  is_wechselschicht_generated?: boolean;
}

export interface ShiftGenerationResult {
  success: boolean;
  shifts: UnifiedGeneratedShift[];
  error?: string;
  positionType?: 'wechselschicht' | 'regular' | 'unknown';
  totalShifts: number;
  periodStart: string;
  periodEnd: string;
}

export class UnifiedShiftGeneratorService {
  /**
   * Universal entry point for generating shifts for any DHL position
   */
  static async generateShiftsForUser(
    userId: string,
    weeksAhead: number = 4
  ): Promise<ShiftGenerationResult> {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + (weeksAhead * 7));

      // Get user's DHL assignment and position details
      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_positions (
            id,
            name,
            position_type
          ),
          dhl_work_groups (
            id,
            name,
            week_number
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (assignmentError || !assignment) {
        console.warn('No active DHL assignment found for user:', userId, assignmentError);
        return {
          success: false,
          shifts: [],
          error: assignmentError?.message || 'Nemáte aktivní DHL přiřazení. Kontaktujte prosím administrátora.',
          totalShifts: 0,
          periodStart: startDate.toISOString().split('T')[0],
          periodEnd: endDate.toISOString().split('T')[0]
        };
      }

      // Determine position type
      const positionName = assignment.dhl_positions?.name || '';
      const positionType = this.determinePositionType(positionName);

      // Generate shifts based on position type
      let shifts: UnifiedGeneratedShift[] = [];
      
      if (positionType === 'wechselschicht') {
        shifts = await this.generateWechselschichtShifts(userId, startDate, endDate, assignment);
      } else if (positionType === 'regular') {
        shifts = await this.generateRegularDHLShifts(userId, startDate, endDate, assignment);
      } else {
        // Unknown position type - try both methods
        console.warn('Unknown position type for:', positionName, 'trying both methods');
        const wechselShifts = await this.generateWechselschichtShifts(userId, startDate, endDate, assignment);
        if (wechselShifts.length > 0) {
          shifts = wechselShifts;
        } else {
          shifts = await this.generateRegularDHLShifts(userId, startDate, endDate, assignment);
        }
        
        // If still no shifts, provide helpful error
        if (shifts.length === 0) {
          return {
            success: false,
            shifts: [],
            error: `Pro pozici "${positionName}" nejsou k dispozici žádná data směnových šablon. Kontaktujte prosím administrátora.`,
            positionType: 'unknown',
            totalShifts: 0,
            periodStart: startDate.toISOString().split('T')[0],
            periodEnd: endDate.toISOString().split('T')[0]
          };
        }
      }

      return {
        success: true,
        shifts,
        positionType,
        totalShifts: shifts.length,
        periodStart: startDate.toISOString().split('T')[0],
        periodEnd: endDate.toISOString().split('T')[0]
      };

    } catch (error) {
      console.error('Error in generateShiftsForUser:', error);
      return {
        success: false,
        shifts: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        totalShifts: 0,
        periodStart: new Date().toISOString().split('T')[0],
        periodEnd: new Date().toISOString().split('T')[0]
      };
    }
  }

  /**
   * Determine position type from position name
   */
  private static determinePositionType(positionName: string): 'wechselschicht' | 'regular' | 'unknown' {
    const name = positionName.toLowerCase();
    if (name.includes('wechselschicht') || name.includes('30h')) {
      return 'wechselschicht';
    }
    // Add more patterns for regular positions if needed
    return 'unknown';
  }

  /**
   * Generate shifts for Wechselschicht positions using patterns
   */
  private static async generateWechselschichtShifts(
    userId: string,
    startDate: Date,
    endDate: Date,
    assignment: any
  ): Promise<UnifiedGeneratedShift[]> {
    const shifts: UnifiedGeneratedShift[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Skip weekends for Wechselschicht (they work Monday-Friday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const shift = await this.generateWechselschichtShiftForDate(userId, new Date(currentDate), assignment);
      if (shift) {
        shifts.push(shift);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return shifts;
  }

  /**
   * Generate shifts for regular DHL positions using templates
   */
  private static async generateRegularDHLShifts(
    userId: string,
    startDate: Date,
    endDate: Date,
    assignment: any
  ): Promise<UnifiedGeneratedShift[]> {
    const shifts: UnifiedGeneratedShift[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const shift = await this.generateRegularDHLShiftForDate(userId, new Date(currentDate), assignment);
      if (shift) {
        shifts.push(shift);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return shifts;
  }

  /**
   * Generate Wechselschicht shift for specific date
   */
  private static async generateWechselschichtShiftForDate(
    userId: string,
    date: Date,
    assignment: any
  ): Promise<UnifiedGeneratedShift | null> {
    // Calculate which Woche to use based on 15-week cycle and user's current setup
    const userCurrentWoche = assignment.current_woche || 1;
    const targetWoche = this.calculateWocheForDate(userCurrentWoche, date);

    // Get the pattern for the calculated Woche
    const { data: pattern } = await supabase
      .from('dhl_wechselschicht_patterns')
      .select('*')
      .eq('woche_number', targetWoche)
      .eq('is_active', true)
      .single();

    if (!pattern) {
      return null;
    }

    // Get shift data for this day of week (Monday=0, Tuesday=1, etc.)
    const dayOfWeek = date.getDay();
    const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0
    
    if (mondayBasedDay > 4) { // Skip weekends
      return null;
    }

    const dayFields = ['monday_shift', 'tuesday_shift', 'wednesday_shift', 'thursday_shift', 'friday_shift'];
    const shiftType = pattern[dayFields[mondayBasedDay]];

    if (!shiftType || shiftType === 'volno') {
      return null;
    }

    // Map shift type to actual times
    const shiftTimes = this.getWechselschichtTimes(pattern, shiftType);
    if (!shiftTimes) {
      return null;
    }

    return {
      user_id: userId,
      date: date.toISOString().split('T')[0],
      start_time: shiftTimes.start,
      end_time: shiftTimes.end,
      type: this.convertWechselschichtType(shiftType),
      dhl_position_id: assignment.dhl_positions?.id,
      dhl_work_group_id: assignment.dhl_work_groups?.id,
      is_dhl_managed: true,
      is_wechselschicht_generated: true,
      notes: `${pattern.pattern_name} - ${shiftType}`,
        original_dhl_data: {
          woche: targetWoche,
          pattern_name: pattern.pattern_name,
          shift_type: shiftType,
          calendar_week: WocheCalculatorService.getCalendarWeek(date)
        }
    };
  }

  /**
   * Generate regular DHL shift for specific date
   */
  private static async generateRegularDHLShiftForDate(
    userId: string,
    date: Date,
    assignment: any
  ): Promise<UnifiedGeneratedShift | null> {
    const userCurrentWoche = assignment.current_woche || 1;
    const targetWoche = this.calculateWocheForDate(userCurrentWoche, date);
    const calendarWeek = WocheCalculatorService.getCalendarWeek(date);

    // Get shift template for this position, woche, and calendar week
    const { data: template } = await supabase
      .from('dhl_position_shift_templates')
      .select('*')
      .eq('position_id', assignment.dhl_positions?.id)
      .eq('woche_number', targetWoche)
      .eq('calendar_week', calendarWeek)
      .single();

    if (!template) {
      return null;
    }

    // Get shift data for this day of week
    const dayOfWeek = date.getDay();
    const dayFields = ['sunday_shift', 'monday_shift', 'tuesday_shift', 'wednesday_shift', 'thursday_shift', 'friday_shift', 'saturday_shift'];
    const shiftData = template[dayFields[dayOfWeek]];

    if (!shiftData || shiftData === 'OFF') {
      return null;
    }

    // Parse shift data (format: "06:00-14:30" or similar)
    const [startTime, endTime] = shiftData.split('-');
    
    return {
      user_id: userId,
      date: date.toISOString().split('T')[0],
      start_time: startTime,
      end_time: endTime,
      type: this.convertTimeToShiftType(startTime),
      dhl_position_id: assignment.dhl_positions?.id,
      dhl_work_group_id: assignment.dhl_work_groups?.id,
      is_dhl_managed: true,
      is_wechselschicht_generated: false,
      notes: `Auto: ${assignment.dhl_positions?.name}`,
      original_dhl_data: {
        template_id: template.id,
        calendar_week: calendarWeek,
        woche: targetWoche
      }
    };
  }

  /**
   * Save generated shifts to database
   */
  static async saveShifts(shifts: UnifiedGeneratedShift[]): Promise<{ success: boolean; error?: string }> {
    try {
      for (const shift of shifts) {
        // Check if shift already exists
        const { data: existing } = await supabase
          .from('shifts')
          .select('id')
          .eq('user_id', shift.user_id)
          .eq('date', shift.date)
          .single();

        if (existing) {
          // Update existing shift
          const { error } = await supabase
            .from('shifts')
            .update({
              start_time: shift.start_time,
              end_time: shift.end_time,
              type: shift.type,
              notes: shift.notes,
              dhl_position_id: shift.dhl_position_id,
              dhl_work_group_id: shift.dhl_work_group_id,
              is_dhl_managed: shift.is_dhl_managed,
              dhl_override: shift.dhl_override,
              original_dhl_data: shift.original_dhl_data,
              is_wechselschicht_generated: shift.is_wechselschicht_generated,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', shift.user_id)
            .eq('date', shift.date);

          if (error) {
            console.error('Error updating shift:', error);
            return { success: false, error: `Chyba při aktualizaci směny: ${error.message}` };
          }
        } else {
          // Insert new shift
          const { error } = await supabase
            .from('shifts')
            .insert({
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
              original_dhl_data: shift.original_dhl_data,
              is_wechselschicht_generated: shift.is_wechselschicht_generated
            });

          if (error) {
            console.error('Error inserting shift:', error);
            return { success: false, error: `Chyba při vytváření směny: ${error.message}` };
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error in saveShifts:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Neznámá chyba' };
    }
  }

  // Helper methods
  private static calculateWocheForDate(userCurrentWoche: number, targetDate: Date): number {
    if (!userCurrentWoche || userCurrentWoche < 1 || userCurrentWoche > 15) {
      return 1;
    }

    // Use the simple Woche calculator that correctly handles the user's current Woche as reference
    return getWocheForDate(userCurrentWoche, targetDate);
  }

  private static getWechselschichtTimes(pattern: any, shiftType: string): { start: string, end: string } | null {
    switch (shiftType.toLowerCase()) {
      case 'ranní':
        return { 
          start: pattern.morning_start_time, 
          end: pattern.morning_end_time 
        };
      case 'odpolední':
        return { 
          start: pattern.afternoon_start_time, 
          end: pattern.afternoon_end_time 
        };
      case 'noční':
        return { 
          start: pattern.night_start_time, 
          end: pattern.night_end_time 
        };
      default:
        return null;
    }
  }

  private static convertWechselschichtType(shiftType: string): 'morning' | 'afternoon' | 'night' {
    switch (shiftType.toLowerCase()) {
      case 'ranní': return 'morning';
      case 'odpolední': return 'afternoon';
      case 'noční': return 'night';
      default: return 'morning';
    }
  }

  private static convertTimeToShiftType(startTime: string): 'morning' | 'afternoon' | 'night' {
    const hour = parseInt(startTime.split(':')[0]);
    if (hour >= 6 && hour < 14) return 'morning';
    if (hour >= 14 && hour < 22) return 'afternoon';
    return 'night';
  }
}