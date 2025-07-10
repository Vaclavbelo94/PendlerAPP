import { supabase } from '@/integrations/supabase/client';
import { calculateCurrentWoche, findShiftForDate } from '@/utils/dhl/wocheCalculator';
import { toast } from 'sonner';

interface GenerateShiftsParams {
  scheduleId: string;
  startDate?: string;
  endDate?: string;
  targetUserId?: string; // Optional: generate for specific user
}

interface GenerateShiftsResult {
  success: boolean;
  message: string;
  generatedCount?: number;
  skippedCount?: number;
}

/**
 * Generate shifts from imported schedule
 */
export const generateShiftsFromSchedule = async (params: GenerateShiftsParams): Promise<GenerateShiftsResult> => {
  console.log('=== GENERATE SHIFTS FROM SCHEDULE ===');
  console.log('Params:', params);

  try {
    // Get the schedule data
    const { data: schedule, error: scheduleError } = await supabase
      .from('dhl_shift_schedules')
      .select(`
        *,
        dhl_positions(id, name, position_type),
        dhl_work_groups(id, name, week_number)
      `)
      .eq('id', params.scheduleId)
      .eq('is_active', true)
      .single();

    if (scheduleError || !schedule) {
      console.error('Schedule not found:', scheduleError);
      return {
        success: false,
        message: 'Plán směn nebyl nalezen'
      };
    }

    console.log('Found schedule:', schedule);

    // Get users with matching position and work group
    let userQuery = supabase
      .from('user_dhl_assignments')
      .select(`
        *,
        profiles(id, email, username)
      `)
      .eq('dhl_position_id', schedule.position_id)
      .eq('dhl_work_group_id', schedule.work_group_id)
      .eq('is_active', true);

    if (params.targetUserId) {
      userQuery = userQuery.eq('user_id', params.targetUserId);
    }

    const { data: users, error: usersError } = await userQuery;

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return {
        success: false,
        message: 'Chyba při načítání uživatelů'
      };
    }

    if (!users || users.length === 0) {
      return {
        success: false,
        message: 'Nebyli nalezeni žádní uživatelé s odpovídající pozicí a pracovní skupinou'
      };
    }

    console.log('Found users:', users.length);

    let generatedCount = 0;
    let skippedCount = 0;

    // Generate shifts for each user
    for (const userAssignment of users) {
      console.log('Generating shifts for user:', userAssignment.user_id);

      // Determine date range
      const startDate = params.startDate ? new Date(params.startDate) : new Date();
      const endDate = params.endDate ? new Date(params.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());

      // Get user's reference point for Woche calculation
      // Use user's assignment reference data if available, otherwise fallback to schedule
      const referenceDate = userAssignment.reference_date ? 
        new Date(userAssignment.reference_date) : 
        new Date(schedule.base_date);
      const referenceWoche = userAssignment.reference_woche !== null ? 
        userAssignment.reference_woche : 
        schedule.base_woche;

      console.log('Reference point:', referenceDate, 'Woche', referenceWoche);

      // Iterate through each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Calculate Woche for this date
        const wocheCalc = calculateCurrentWoche(
          { referenceDate, referenceWoche },
          new Date(currentDate)
        );

        console.log('Processing date:', dateStr, 'Woche:', wocheCalc.currentWoche);

        // Find shift data for this date and Woche
        const shiftData = findShiftForDate(schedule.schedule_data, wocheCalc.currentWoche, currentDate);

        // If shiftData is explicitly null, user has day off - skip
        if (shiftData === null) {
          console.log('Day off for', dateStr, 'Woche:', wocheCalc.currentWoche);
          // Move to next day without creating shift
        } else if (shiftData && shiftData.start_time && shiftData.end_time) {
          console.log('Found shift data for', dateStr, ':', shiftData);

          // Check if shift already exists
          const { data: existingShift, error: checkError } = await supabase
            .from('shifts')
            .select('id')
            .eq('user_id', userAssignment.user_id)
            .eq('date', dateStr)
            .maybeSingle();

          if (checkError) {
            console.error('Error checking existing shift:', checkError);
            continue;
          }

          if (existingShift) {
            console.log('Shift already exists for', dateStr, '- skipping');
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

            // Create new shift
            const { error: insertError } = await supabase
              .from('shifts')
              .insert([{
                user_id: userAssignment.user_id,
                date: dateStr,
                type: shiftType as 'morning' | 'afternoon' | 'night',
                start_time: getDefaultStartTime(shiftType as 'morning' | 'afternoon' | 'night'),
                end_time: getDefaultEndTime(shiftType as 'morning' | 'afternoon' | 'night'),
                dhl_position_id: schedule.position_id,
                dhl_work_group_id: schedule.work_group_id,
                is_dhl_managed: true,
                original_dhl_data: {
                  start_time: shiftData.start_time,
                  end_time: shiftData.end_time,
                  woche: wocheCalc.currentWoche,
                  schedule_id: schedule.id,
                  generated_at: new Date().toISOString()
                }
              }]);

            if (insertError) {
              console.error('Error creating shift:', insertError);
            } else {
              console.log('Created shift for', dateStr);
              generatedCount++;
            }
          }
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    console.log('=== GENERATION COMPLETE ===');
    console.log('Generated:', generatedCount, 'Skipped:', skippedCount);

    return {
      success: true,
      message: `Úspěšně vygenerováno ${generatedCount} směn${skippedCount > 0 ? `, přeskočeno ${skippedCount} existujících` : ''}`,
      generatedCount,
      skippedCount
    };

  } catch (error) {
    console.error('Error generating shifts:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Neočekávaná chyba při generování směn'
    };
  }
};

/**
 * Generate shifts for specific user and date range
 */
export const generateUserShifts = async (userId: string, startDate: string, endDate: string): Promise<GenerateShiftsResult> => {
  console.log('=== GENERATE USER SHIFTS ===');
  console.log('User:', userId, 'Range:', startDate, 'to', endDate);

  try {
    // Get user's DHL assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('user_dhl_assignments')
      .select(`
        *,
        dhl_positions(id, name, position_type),
        dhl_work_groups(id, name, week_number)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (assignmentError || !assignment) {
      console.log('No DHL assignment found for user:', userId, assignmentError);
      return {
        success: false,
        message: 'Uživatel nemá přiřazení DHL pozice a pracovní skupiny'
      };
    }

    console.log('Found user assignment:', assignment);
    
    // Get user's work group week number for matching with base_woche
    const userWocheNumber = assignment.dhl_work_groups?.week_number;
    console.log('User Woche number:', userWocheNumber);

    if (!userWocheNumber) {
      return {
        success: false,
        message: 'Uživatel nemá platné číslo týdne (Woche) v pracovní skupině'
      };
    }

    // Find active schedule for this position
    // For annual plans, search by position_id and base_woche (work_group_id should be null)
    const { data: schedule, error: scheduleError } = await supabase
      .from('dhl_shift_schedules')
      .select('*')
      .eq('position_id', assignment.dhl_position_id)
      .eq('base_woche', userWocheNumber)
      .eq('is_active', true)
      .is('work_group_id', null) // Annual plans have work_group_id = null
      .order('created_at', { ascending: false })
      .maybeSingle();

    console.log('Schedule query result:', { schedule, scheduleError });

    if (scheduleError || !schedule) {
      return {
        success: false,
        message: 'Nebyl nalezen aktivní plán směn pro tuto pozici a pracovní skupinu'
      };
    }

    // Use the schedule-based generation
    return await generateShiftsFromSchedule({
      scheduleId: schedule.id,
      startDate,
      endDate,
      targetUserId: userId
    });

  } catch (error) {
    console.error('Error generating user shifts:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Neočekávaná chyba při generování směn'
    };
  }
};

const getDefaultStartTime = (type: 'morning' | 'afternoon' | 'night'): string => {
  switch (type) {
    case 'morning': return '06:00';
    case 'afternoon': return '14:00';
    case 'night': return '22:00';
    default: return '08:00';
  }
};

const getDefaultEndTime = (type: 'morning' | 'afternoon' | 'night'): string => {
  switch (type) {
    case 'morning': return '14:00';
    case 'afternoon': return '22:00';
    case 'night': return '06:00';
    default: return '16:00';
  }
};
