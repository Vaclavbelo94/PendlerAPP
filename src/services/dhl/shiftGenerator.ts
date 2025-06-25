
import { supabase } from '@/integrations/supabase/client';
import { calculateCurrentWoche, generateWocheRange, findShiftForDate, determineShiftType, WocheReference } from '@/utils/dhl/wocheCalculator';
import { toast } from 'sonner';

export interface GenerateShiftsParams {
  scheduleId: string;
  userId?: string; // If specified, generate only for this user
  startDate?: Date;
  endDate?: Date; // If not specified, generate for next 3 months
  forceRegenerate?: boolean; // Replace existing shifts
}

export interface GeneratedShift {
  userId: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  dhlPositionId: string;
  dhlWorkGroupId: string;
  isDhlManaged: boolean;
  originalDhlData: any;
}

/**
 * Generate shifts for users based on imported schedule
 */
export const generateShiftsFromSchedule = async (params: GenerateShiftsParams) => {
  console.log('=== SHIFT GENERATION START ===');
  console.log('Parameters:', params);

  try {
    // Get the schedule data
    const { data: schedule, error: scheduleError } = await supabase
      .from('dhl_shift_schedules')
      .select(`
        *,
        dhl_positions(id, name),
        dhl_work_groups(id, name, week_number)
      `)
      .eq('id', params.scheduleId)
      .eq('is_active', true)
      .single();

    if (scheduleError || !schedule) {
      console.error('Schedule not found:', scheduleError);
      throw new Error('Schedule not found');
    }

    console.log('Using schedule:', schedule);

    // Get users with matching position and work group assignments
    let userQuery = supabase
      .from('user_dhl_assignments')
      .select(`
        user_id,
        reference_date,
        reference_woche,
        dhl_position_id,
        dhl_work_group_id
      `)
      .eq('dhl_position_id', schedule.position_id)
      .eq('dhl_work_group_id', schedule.work_group_id)
      .eq('is_active', true);

    if (params.userId) {
      userQuery = userQuery.eq('user_id', params.userId);
    }

    const { data: users, error: usersError } = await userQuery;

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw new Error('Failed to fetch users');
    }

    if (!users || users.length === 0) {
      console.log('No users found for this position/work group combination');
      return {
        success: true,
        message: 'No users found for this position/work group combination',
        generatedCount: 0
      };
    }

    console.log('Found users:', users);

    // Set date range
    const startDate = params.startDate || new Date();
    const endDate = params.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 3 months

    console.log('Date range:', { startDate, endDate });

    let totalGenerated = 0;
    const generatedShifts: GeneratedShift[] = [];

    // Generate shifts for each user
    for (const user of users) {
      console.log('Processing user:', user.user_id);

      // Create reference point for user
      let userReference: WocheReference;
      
      if (user.reference_date && user.reference_woche) {
        userReference = {
          referenceDate: new Date(user.reference_date),
          referenceWoche: user.reference_woche
        };
        console.log('Using user reference:', userReference);
      } else {
        // Use schedule base as reference
        userReference = {
          referenceDate: new Date(schedule.base_date),
          referenceWoche: schedule.base_woche
        };
        console.log('Using schedule reference:', userReference);
      }

      // Generate Woche range for the period
      const wocheRange = generateWocheRange(userReference, startDate, endDate);
      console.log('Generated Woche range:', wocheRange.length, 'weeks');

      // Generate shifts for each week
      for (const wocheCalc of wocheRange) {
        console.log('Processing Woche:', wocheCalc.currentWoche);

        // Check each day of the week
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const currentDate = new Date(wocheCalc.weekStartDate);
          currentDate.setDate(currentDate.getDate() + dayOffset);

          // Skip dates outside our range
          if (currentDate < startDate || currentDate > endDate) {
            continue;
          }

          // Look for shift data for this date/Woche
          const shiftData = findShiftForDate(
            schedule.schedule_data, 
            wocheCalc.currentWoche, 
            currentDate
          );

          if (shiftData && shiftData.start_time && shiftData.end_time) {
            console.log('Found shift data for', currentDate.toISOString().split('T')[0], ':', shiftData);

            // Check if shift already exists (unless force regenerate)
            if (!params.forceRegenerate) {
              const { data: existingShift } = await supabase
                .from('shifts')
                .select('id')
                .eq('user_id', user.user_id)
                .eq('date', currentDate.toISOString().split('T')[0])
                .maybeSingle();

              if (existingShift) {
                console.log('Shift already exists, skipping');
                continue;
              }
            }

            // Create shift object
            const shift: GeneratedShift = {
              userId: user.user_id,
              date: currentDate.toISOString().split('T')[0],
              type: determineShiftType(shiftData.start_time),
              notes: `Auto-generated from DHL schedule (Woche ${wocheCalc.currentWoche})`,
              dhlPositionId: schedule.position_id,
              dhlWorkGroupId: schedule.work_group_id,
              isDhlManaged: true,
              originalDhlData: {
                scheduleId: schedule.id,
                woche: wocheCalc.currentWoche,
                startTime: shiftData.start_time,
                endTime: shiftData.end_time,
                originalData: shiftData
              }
            };

            generatedShifts.push(shift);
          }
        }
      }
    }

    console.log('Generated shifts total:', generatedShifts.length);

    // Insert shifts in batches
    if (generatedShifts.length > 0) {
      // Delete existing shifts if force regenerate
      if (params.forceRegenerate) {
        const userIds = users.map(u => u.user_id);
        const { error: deleteError } = await supabase
          .from('shifts')
          .delete()
          .in('user_id', userIds)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])
          .eq('is_dhl_managed', true);

        if (deleteError) {
          console.error('Error deleting existing shifts:', deleteError);
        }
      }

      // Insert new shifts
      const shiftsToInsert = generatedShifts.map(shift => ({
        user_id: shift.userId,
        date: shift.date,
        type: shift.type,
        notes: shift.notes,
        dhl_position_id: shift.dhlPositionId,
        dhl_work_group_id: shift.dhlWorkGroupId,
        is_dhl_managed: shift.isDhlManaged,
        dhl_override: false,
        original_dhl_data: shift.originalDhlData
      }));

      console.log('Inserting shifts:', shiftsToInsert.length);

      const { data: insertedShifts, error: insertError } = await supabase
        .from('shifts')
        .insert(shiftsToInsert)
        .select('id');

      if (insertError) {
        console.error('Error inserting shifts:', insertError);
        throw new Error(`Failed to insert shifts: ${insertError.message}`);
      }

      totalGenerated = insertedShifts?.length || 0;
    }

    console.log('=== SHIFT GENERATION SUCCESS ===');
    console.log('Total generated:', totalGenerated);

    return {
      success: true,
      message: `Successfully generated ${totalGenerated} shifts for ${users.length} users`,
      generatedCount: totalGenerated,
      usersProcessed: users.length
    };

  } catch (error) {
    console.error('Shift generation error:', error);
    throw error;
  }
};

/**
 * Set user's reference Woche point
 */
export const setUserWocheReference = async (userId: string, referenceDate: Date, referenceWoche: number) => {
  console.log('Setting user Woche reference:', { userId, referenceDate, referenceWoche });

  const { error } = await supabase
    .from('user_dhl_assignments')
    .update({
      reference_date: referenceDate.toISOString().split('T')[0],
      reference_woche: referenceWoche
    })
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('Error setting user reference:', error);
    throw error;
  }

  toast.success('User Woche reference updated successfully');
};

/**
 * Get user's current Woche information
 */
export const getUserCurrentWoche = async (userId: string) => {
  const { data: assignment, error } = await supabase
    .from('user_dhl_assignments')
    .select('reference_date, reference_woche, dhl_position_id, dhl_work_group_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user assignment:', error);
    return null;
  }

  if (!assignment || !assignment.reference_date || !assignment.reference_woche) {
    return null;
  }

  const reference: WocheReference = {
    referenceDate: new Date(assignment.reference_date),
    referenceWoche: assignment.reference_woche
  };

  return calculateCurrentWoche(reference);
};
