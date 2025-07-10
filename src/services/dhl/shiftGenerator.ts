import { supabase } from '@/integrations/supabase/client';
import { getWocheForDate, calculateSimpleWoche } from '@/utils/dhl/simpleWocheCalculator';
import { findShiftForDate } from '@/utils/dhl/wocheCalculator';
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
        dhl_positions(id, name, position_type, cycle_weeks),
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

    // Get users with matching position
    // For annual plans, work_group_id might be null, so we handle both cases
    let userQuery = supabase
      .from('user_dhl_assignments')
      .select(`
        *,
        profiles(id, email, username)
      `)
      .eq('dhl_position_id', schedule.position_id)
      .eq('is_active', true);

    // If schedule has work_group_id, filter by it
    // If schedule is annual plan (work_group_id is null), we still include users without work_group_id
    if (schedule.work_group_id) {
      userQuery = userQuery.eq('dhl_work_group_id', schedule.work_group_id);
    }

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
        message: `Nebyli nalezeni žádní uživatelé s odpovídající pozicí ${schedule.dhl_positions?.name || schedule.position_id}${schedule.work_group_id ? ` a pracovní skupinou ${schedule.dhl_work_groups?.name || schedule.work_group_id}` : ' (individuální přiřazení)'}`
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
        
        // Calculate Woche for this date using simplified method
        const currentWoche = getWocheForDate(referenceWoche, new Date(currentDate));

        console.log('Processing date:', dateStr, 'Woche:', currentWoche);

        // Get position's cycle weeks for rotation checking
        const positionCycleWeeks = schedule.dhl_positions?.cycle_weeks || [];
        
        // Find shift data for this date and Woche (with rotation logic)
        const shiftData = findShiftForDate(schedule.schedule_data, currentWoche, currentDate, positionCycleWeeks);

        // If shiftData is explicitly null, user has day off - skip
        if (shiftData === null) {
          console.log('Day off for', dateStr, 'Woche:', currentWoche);
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
                  woche: currentWoche,
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
    // Get user's DHL assignment with proper JOIN to profiles
    const { data: assignment, error: assignmentError } = await supabase
      .from('user_dhl_assignments')
      .select(`
        *,
        dhl_positions(id, name, position_type, cycle_weeks),
        dhl_work_groups(id, name, week_number)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (assignmentError || !assignment) {
      console.log('No DHL assignment found for user:', userId, assignmentError);
      return {
        success: false,
        message: 'Uživatel nemá přiřazení DHL pozice a pracovní skupiny'
      };
    }

    console.log('Found user assignment:', assignment);
    
    // Get user's Woche number - use simplified current_woche or fallback
    const userWocheNumber = assignment.current_woche || assignment.reference_woche || assignment.dhl_work_groups?.week_number;
    console.log('User Woche number:', userWocheNumber, '(from current_woche:', assignment.current_woche, ', reference_woche:', assignment.reference_woche, ', work_group:', assignment.dhl_work_groups?.week_number, ')');

    if (!userWocheNumber) {
      return {
        success: false,
        message: 'Uživatel nemá platné číslo týdne (Woche) - ani individuální ani skupinové'
      };
    }

    // Get all active schedules for this position (annual plans)
    // For annual plans with individual assignments, we search by position only
    // since work_group_id is null for individual assignments
    const { data: schedules, error: schedulesError } = await supabase
      .from('dhl_shift_schedules')
      .select('*')
      .eq('position_id', assignment.dhl_position_id)
      .eq('is_active', true)
      .eq('annual_plan', true)
      .is('work_group_id', null) // Only get schedules for individual assignments
      .order('calendar_week', { ascending: true });

    console.log('=== SCHEDULES LOOKUP ===');
    console.log('Looking for schedules with:');
    console.log('- position_id:', assignment.dhl_position_id);
    console.log('- base_woche:', userWocheNumber);
    console.log('- annual_plan: true');
    console.log('Schedules query result:', { schedules, schedulesError });

    if (schedulesError) {
      console.error('Database error fetching schedules:', schedulesError);
      return {
        success: false,
        message: `Chyba databáze při načítání plánů: ${schedulesError.message}`
      };
    }

    if (!schedules || schedules.length === 0) {
      console.log('=== NO SCHEDULES FOUND - DEBUGGING ===');
      
      // Let's check what schedules exist for this position
      const { data: allSchedules } = await supabase
        .from('dhl_shift_schedules')
        .select('id, position_id, base_woche, annual_plan, work_group_id, calendar_week, schedule_name')
        .eq('position_id', assignment.dhl_position_id)
        .eq('is_active', true);
        
      console.log('All schedules for this position:', allSchedules);
      
      // Check if there are any schedules with different criteria
      const { data: anySchedules } = await supabase
        .from('dhl_shift_schedules')
        .select('id, position_id, base_woche, annual_plan, work_group_id, calendar_week, schedule_name')
        .eq('position_id', assignment.dhl_position_id);
        
      console.log('All schedules for this position (including inactive):', anySchedules);
      
      return {
        success: false,
        message: `Nebyl nalezen aktivní roční plán směn pro tuto pozici (${assignment.dhl_positions?.name}) a Woche ${userWocheNumber}. Nalezeno celkem ${allSchedules?.length || 0} plánů pro tuto pozici.`
      };
    }

    console.log(`Found ${schedules.length} annual schedules for user Woche ${userWocheNumber}`);

    // Now generate shifts for the date range using annual rotation logic
    let generatedCount = 0;
    let skippedCount = 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date(start);

    // Get reference point for rotation calculation
    const referenceDate = assignment.reference_date ? 
      new Date(assignment.reference_date) : 
      new Date(); // Use current date as fallback
    const referenceWoche = assignment.reference_woche !== null ? 
      assignment.reference_woche : 
      userWocheNumber;

    console.log('Reference point for rotation:', referenceDate, 'Woche', referenceWoche);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Import findAnnualShiftForDate from wocheCalculator
      const { findAnnualShiftForDate, getCalendarWeek } = await import('@/utils/dhl/wocheCalculator');
      
      // Create a combined schedule object from all calendar weeks
      const combinedSchedule: any = {};
      if (!schedules || schedules.length === 0) {
        console.error('No schedules available for combined schedule creation');
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      schedules.forEach(schedule => {
        if (schedule?.calendar_week && schedule?.schedule_data) {
          const calendarWeekKey = `KW${schedule.calendar_week.toString().padStart(2, '0')}`;
          combinedSchedule[calendarWeekKey] = schedule.schedule_data;
          console.log(`Added schedule for ${calendarWeekKey}:`, Object.keys(schedule.schedule_data));
        }
      });

      console.log('=== COMBINED SCHEDULE STRUCTURE ===');
      console.log('Available calendar weeks:', Object.keys(combinedSchedule));
      
      // Log sample structure for first available week
      const firstWeekKey = Object.keys(combinedSchedule)[0];
      if (firstWeekKey && combinedSchedule[firstWeekKey]) {
        console.log(`Sample structure for ${firstWeekKey}:`, Object.keys(combinedSchedule[firstWeekKey]));
        const firstWocheKey = Object.keys(combinedSchedule[firstWeekKey])[0];
        if (firstWocheKey) {
          console.log(`Sample days for ${firstWeekKey}.${firstWocheKey}:`, Object.keys(combinedSchedule[firstWeekKey][firstWocheKey]));
        }
      }

      // Calculate user's rotated Woche for this specific date
      // using simplified calendar-based rotation
      if (!userWocheNumber) {
        console.error('userWocheNumber is null/undefined, skipping date:', dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      const targetCalendarWeek = getCalendarWeek(currentDate);
      const currentCalendarWeek = getCalendarWeek(new Date());
      const wocheOffset = targetCalendarWeek - currentCalendarWeek;
      const rotatedWoche = calculateSimpleWoche(userWocheNumber, wocheOffset);

      console.log(`Date ${dateStr}: CW${targetCalendarWeek}, user base Woche ${userWocheNumber}, offset ${wocheOffset}, rotated Woche ${rotatedWoche}`);

      // Validate combinedSchedule before use
      if (!combinedSchedule || Object.keys(combinedSchedule).length === 0) {
        console.error('combinedSchedule is empty or null, skipping date:', dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Find shift data for this date using rotated Woche
      const shiftData = findAnnualShiftForDate(
        combinedSchedule, 
        rotatedWoche, 
        currentDate
      );

      console.log(`Processing date ${dateStr} (CW${getCalendarWeek(currentDate)}):`, shiftData);

      // If shiftData is explicitly null, user has day off - skip
      if (shiftData === null) {
        console.log('Day off for', dateStr);
      } else if (shiftData && shiftData.start_time && shiftData.end_time) {
        console.log('Found shift data for', dateStr, ':', shiftData);

        // Check if shift already exists
        const { data: existingShift, error: checkError } = await supabase
          .from('shifts')
          .select('id')
          .eq('user_id', userId)
          .eq('date', dateStr)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing shift:', checkError);
          currentDate.setDate(currentDate.getDate() + 1);
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
              user_id: userId,
              date: dateStr,
              type: shiftType,
              start_time: shiftData.start_time,
              end_time: shiftData.end_time,
              dhl_position_id: assignment.dhl_position_id,
              dhl_work_group_id: assignment.dhl_work_group_id,
              is_dhl_managed: true,
              original_dhl_data: {
                start_time: shiftData.start_time,
                end_time: shiftData.end_time,
                user_woche: userWocheNumber,
                calendar_week: getCalendarWeek(currentDate),
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

    console.log('=== GENERATION COMPLETE ===');
    console.log('Generated:', generatedCount, 'Skipped:', skippedCount);

    return {
      success: true,
      message: `Úspěšně vygenerováno ${generatedCount} směn${skippedCount > 0 ? `, přeskočeno ${skippedCount} existujících` : ''}`,
      generatedCount,
      skippedCount
    };

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
