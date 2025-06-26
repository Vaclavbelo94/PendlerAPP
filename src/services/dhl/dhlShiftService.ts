
import { supabase } from '@/integrations/supabase/client';
import { calculateCurrentWoche, findShiftForDate } from '@/utils/dhl/wocheCalculator';
import { toast } from 'sonner';

export interface DHLShiftGenerationResult {
  success: boolean;
  message: string;
  generatedCount: number;
  skippedCount: number;
  conflicts: Array<{
    date: string;
    reason: string;
  }>;
}

export class DHLShiftService {
  /**
   * Generate shifts for a specific user based on their DHL assignment
   */
  static async generateUserShifts(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<DHLShiftGenerationResult> {
    console.log('=== DHL SHIFT GENERATION ===');
    console.log('User:', userId, 'Period:', startDate.toDateString(), 'to', endDate.toDateString());

    try {
      // Get user's DHL assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (assignmentError || !assignment) {
        return {
          success: false,
          message: 'Uživatel nemá přiřazení DHL pozice',
          generatedCount: 0,
          skippedCount: 0,
          conflicts: []
        };
      }

      // Get active schedule for this position and work group
      const { data: schedule, error: scheduleError } = await supabase
        .from('dhl_shift_schedules')
        .select('*')
        .eq('position_id', assignment.dhl_position_id)
        .eq('work_group_id', assignment.dhl_work_group_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (scheduleError || !schedule) {
        return {
          success: false,
          message: 'Nebyl nalezen aktivní plán směn pro tuto pozici',
          generatedCount: 0,
          skippedCount: 0,
          conflicts: []
        };
      }

      let generatedCount = 0;
      let skippedCount = 0;
      const conflicts: Array<{ date: string; reason: string }> = [];

      // Reference point for Woche calculation
      const referenceDate = assignment.reference_date ? 
        new Date(assignment.reference_date) : 
        new Date(schedule.base_date);
      const referenceWoche = assignment.reference_woche || schedule.base_woche;

      // Generate shifts for each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];

        // Calculate Woche for this date
        const wocheCalc = calculateCurrentWoche(
          { referenceDate, referenceWoche },
          new Date(currentDate)
        );

        // Find shift data for this date and Woche
        const shiftData = findShiftForDate(schedule.schedule_data, wocheCalc.currentWoche, currentDate);

        if (shiftData && shiftData.start_time && shiftData.end_time) {
          // Check if shift already exists (check for conflicts)
          const { data: existingShift, error: checkError } = await supabase
            .from('shifts')
            .select('id, is_dhl_managed')
            .eq('user_id', userId)
            .eq('date', dateStr)
            .maybeSingle();

          if (checkError) {
            console.error('Error checking existing shift:', checkError);
            continue;
          }

          if (existingShift) {
            if (!existingShift.is_dhl_managed) {
              conflicts.push({
                date: dateStr,
                reason: 'Existuje manuální směna pro tento den'
              });
            }
            skippedCount++;
          } else {
            // Determine shift type based on start time
            const startHour = parseInt(shiftData.start_time.split(':')[0]);
            let shiftType: 'morning' | 'afternoon' | 'night' = 'morning';
            
            if (startHour >= 6 && startHour < 14) {
              shiftType = 'morning';
            } else if (startHour >= 14 && startHour < 22) {
              shiftType = 'afternoon';
            } else {
              shiftType = 'night';
            }

            // Create new DHL-managed shift
            const { error: insertError } = await supabase
              .from('shifts')
              .insert({
                user_id: userId,
                date: dateStr,
                type: shiftType,
                dhl_position_id: assignment.dhl_position_id,
                dhl_work_group_id: assignment.dhl_work_group_id,
                is_dhl_managed: true,
                notes: `DHL generovaná směna - ${shiftData.start_time}-${shiftData.end_time}`,
                original_dhl_data: {
                  start_time: shiftData.start_time,
                  end_time: shiftData.end_time,
                  woche: wocheCalc.currentWoche,
                  schedule_id: schedule.id,
                  generated_at: new Date().toISOString()
                }
              });

            if (insertError) {
              console.error('Error creating shift:', insertError);
              conflicts.push({
                date: dateStr,
                reason: 'Chyba při vytváření směny: ' + insertError.message
              });
            } else {
              generatedCount++;
              console.log('Created DHL shift for', dateStr);
            }
          }
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const message = conflicts.length > 0 
        ? `Vygenerováno ${generatedCount} směn, ${conflicts.length} konfliktů`
        : `Úspěšně vygenerováno ${generatedCount} směn`;

      return {
        success: true,
        message,
        generatedCount,
        skippedCount,
        conflicts
      };

    } catch (error) {
      console.error('Error generating DHL shifts:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Neočekávaná chyba',
        generatedCount: 0,
        skippedCount: 0,
        conflicts: []
      };
    }
  }

  /**
   * Check for conflicts between DHL and manual shifts
   */
  static async checkShiftConflicts(userId: string, startDate: Date, endDate: Date) {
    const { data: shifts, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date');

    if (error) {
      console.error('Error checking conflicts:', error);
      return [];
    }

    const conflicts = [];
    const dateGroups = new Map();

    // Group shifts by date
    shifts?.forEach(shift => {
      if (!dateGroups.has(shift.date)) {
        dateGroups.set(shift.date, []);
      }
      dateGroups.get(shift.date).push(shift);
    });

    // Check for conflicts (multiple shifts on same date with different sources)
    dateGroups.forEach((dateShifts, date) => {
      if (dateShifts.length > 1) {
        const hasDHL = dateShifts.some((s: any) => s.is_dhl_managed);
        const hasManual = dateShifts.some((s: any) => !s.is_dhl_managed);
        
        if (hasDHL && hasManual) {
          conflicts.push({
            date,
            shifts: dateShifts,
            type: 'dhl_manual_conflict'
          });
        }
      }
    });

    return conflicts;
  }
}
