// Annual plan import utilities for DHL rotational system

import { supabase } from '@/integrations/supabase/client';
import { AnnualPlanImportData, DHLPosition } from '@/types/dhl';
import { getCalendarWeek } from './wocheCalculator';

export interface AnnualPlanValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalWeeks: number;
    totalWocheGroups: number;
    positionName: string;
  };
}

/**
 * Validate annual plan data structure
 */
export const validateAnnualPlan = (data: AnnualPlanImportData): AnnualPlanValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if position name exists
  if (!data.position_name || data.position_name.trim() === '') {
    errors.push('Position name is required');
  }
  
  // Check calendar weeks structure
  const calendarWeeks = Object.keys(data.calendar_weeks || {});
  if (calendarWeeks.length === 0) {
    errors.push('No calendar weeks found');
  }
  
  let totalWocheGroups = 0;
  const expectedWeeks = Array.from({ length: 53 }, (_, i) => `KW${(i + 1).toString().padStart(2, '0')}`);
  
  // Validate each calendar week
  calendarWeeks.forEach(kw => {
    if (!kw.match(/^KW\d{2}$/)) {
      errors.push(`Invalid calendar week format: ${kw}. Expected format: KW01, KW02, etc.`);
      return;
    }
    
    const weekData = data.calendar_weeks[kw];
    const wocheGroups = Object.keys(weekData || {});
    
    if (wocheGroups.length === 0) {
      warnings.push(`No woche groups found for ${kw}`);
      return;
    }
    
    // Track unique woche groups
    wocheGroups.forEach(woche => {
      if (!woche.match(/^woche\d{1,2}$/)) {
        errors.push(`Invalid woche group format: ${woche} in ${kw}. Expected format: woche1, woche2, etc.`);
        return;
      }
      
      const wocheNumber = parseInt(woche.replace('woche', ''));
      if (wocheNumber < 1 || wocheNumber > 15) {
        errors.push(`Invalid woche number: ${wocheNumber} in ${kw}. Must be between 1 and 15.`);
      }
      
      const shiftData = weekData[woche];
      if (shiftData && !shiftData.is_off) {
        if (!shiftData.start_time || !shiftData.end_time) {
          warnings.push(`Missing time data for ${woche} in ${kw}`);
        }
      }
    });
    
    totalWocheGroups = Math.max(totalWocheGroups, wocheGroups.length);
  });
  
  // Check for missing weeks
  const missingWeeks = expectedWeeks.filter(week => !calendarWeeks.includes(week));
  if (missingWeeks.length > 0) {
    warnings.push(`Missing calendar weeks: ${missingWeeks.slice(0, 5).join(', ')}${missingWeeks.length > 5 ? '...' : ''}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalWeeks: calendarWeeks.length,
      totalWocheGroups,
      positionName: data.position_name
    }
  };
};

/**
 * Import annual plan data into database
 */
export const importAnnualPlan = async (
  data: AnnualPlanImportData,
  adminUserId: string
): Promise<{ success: boolean; error?: string; scheduleIds?: string[] }> => {
  try {
    // First, find the position by name
    const { data: positions, error: positionError } = await supabase
      .from('dhl_positions')
      .select('id, name')
      .eq('name', data.position_name)
      .eq('is_active', true)
      .single();
    
    if (positionError || !positions) {
      return { success: false, error: `Position not found: ${data.position_name}` };
    }
    
    const positionId = positions.id;
    const scheduleIds: string[] = [];
    
    // Import each calendar week
    for (const [calendarWeekKey, weekData] of Object.entries(data.calendar_weeks)) {
      const calendarWeek = parseInt(calendarWeekKey.replace('KW', ''));
      
      // Import each woche group for this calendar week
      for (const [wocheKey, shiftData] of Object.entries(weekData)) {
        const wocheGroup = parseInt(wocheKey.replace('woche', ''));
        
        // Prepare schedule data - convert to daily format
        const scheduleData = {
          monday: shiftData.is_off ? null : shiftData,
          tuesday: shiftData.is_off ? null : shiftData,
          wednesday: shiftData.is_off ? null : shiftData,
          thursday: shiftData.is_off ? null : shiftData,
          friday: shiftData.is_off ? null : shiftData,
          saturday: shiftData.is_off ? null : shiftData,
          sunday: shiftData.is_off ? null : shiftData,
        };
        
        // Create schedule record
        const { data: scheduleRecord, error: scheduleError } = await supabase
          .from('dhl_shift_schedules')
          .insert({
            position_id: positionId,
            work_group_id: null, // Not used in annual system
            schedule_name: `${data.position_name} - ${calendarWeekKey} - ${wocheKey}`,
            schedule_data: scheduleData,
            base_date: `${new Date().getFullYear()}-01-01`,
            base_woche: wocheGroup,
            calendar_week: calendarWeek,
            annual_plan: true,
            woche_group: wocheGroup,
            is_active: true
          })
          .select('id')
          .single();
        
        if (scheduleError) {
          console.error('Error creating schedule:', scheduleError);
          return { success: false, error: `Failed to create schedule for ${calendarWeekKey} ${wocheKey}` };
        }
        
        if (scheduleRecord) {
          scheduleIds.push(scheduleRecord.id);
        }
      }
    }
    
    // Log the import
    await supabase
      .from('dhl_schedule_imports')
      .insert({
        admin_user_id: adminUserId,
        file_name: `Annual Plan - ${data.position_name}`,
        import_status: 'success',
        records_processed: scheduleIds.length,
        metadata: {
          position_name: data.position_name,
          calendar_weeks_imported: Object.keys(data.calendar_weeks).length,
          import_type: 'annual_plan'
        }
      });
    
    return { success: true, scheduleIds };
  } catch (error) {
    console.error('Annual plan import error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Parse Excel/CSV data to annual plan format
 */
export const parseAnnualPlanData = (
  rawData: any[][],
  positionName: string
): AnnualPlanImportData => {
  const calendarWeeks: AnnualPlanImportData['calendar_weeks'] = {};
  
  // Assume first row contains woche headers (woche1, woche2, etc.)
  // Subsequent rows contain calendar weeks (KW01, KW02, etc.)
  
  if (rawData.length < 2) {
    return { position_name: positionName, calendar_weeks: {} };
  }
  
  const headers = rawData[0];
  const wocheHeaders = headers.slice(1); // Skip first column (calendar week)
  
  for (let rowIndex = 1; rowIndex < rawData.length; rowIndex++) {
    const row = rawData[rowIndex];
    const calendarWeekKey = row[0]; // First column should be KWxx
    
    if (!calendarWeekKey || !calendarWeekKey.match(/^KW\d{2}$/)) {
      continue; // Skip invalid rows
    }
    
    const weekData: { [wocheGroup: string]: any } = {};
    
    for (let colIndex = 1; colIndex < row.length && colIndex - 1 < wocheHeaders.length; colIndex++) {
      const wocheHeader = wocheHeaders[colIndex - 1];
      const cellValue = row[colIndex];
      
      if (!wocheHeader || !wocheHeader.match(/^woche\d{1,2}$/)) {
        continue;
      }
      
      // Parse cell value - could be time range or empty for day off
      if (!cellValue || cellValue === '' || cellValue === 'OFF') {
        weekData[wocheHeader] = { is_off: true };
      } else {
        // Try to parse time range (e.g., "06:00-14:00")
        const timeMatch = cellValue.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
        if (timeMatch) {
          weekData[wocheHeader] = {
            start_time: timeMatch[1],
            end_time: timeMatch[2],
            shift_type: determineShiftType(timeMatch[1])
          };
        } else {
          weekData[wocheHeader] = { is_off: true };
        }
      }
    }
    
    calendarWeeks[calendarWeekKey] = weekData;
  }
  
  return {
    position_name: positionName,
    calendar_weeks: calendarWeeks
  };
};

const determineShiftType = (startTime: string): 'morning' | 'afternoon' | 'night' => {
  const [hours] = startTime.split(':').map(Number);
  
  if (hours >= 6 && hours < 13) {
    return 'morning';
  } else if (hours >= 13 && hours < 22) {
    return 'afternoon';
  } else {
    return 'night';
  }
};

/**
 * Get annual plan for a position
 */
export const getAnnualPlanForPosition = async (positionId: string) => {
  const { data, error } = await supabase
    .from('dhl_shift_schedules')
    .select('*')
    .eq('position_id', positionId)
    .eq('annual_plan', true)
    .eq('is_active', true)
    .order('calendar_week', { ascending: true })
    .order('woche_group', { ascending: true });
  
  if (error) {
    console.error('Error fetching annual plan:', error);
    return null;
  }
  
  // Convert to structured format
  const annualPlan: { [calendarWeek: string]: { [wocheGroup: string]: any } } = {};
  
  data?.forEach(schedule => {
    if (!schedule.calendar_week || !schedule.woche_group) return;
    
    const kwKey = `KW${schedule.calendar_week.toString().padStart(2, '0')}`;
    const wocheKey = `woche${schedule.woche_group}`;
    
    if (!annualPlan[kwKey]) {
      annualPlan[kwKey] = {};
    }
    
    annualPlan[kwKey][wocheKey] = schedule.schedule_data;
  });
  
  return annualPlan;
};