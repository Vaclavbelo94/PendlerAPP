// Annual plan import utilities for DHL rotational system

import * as XLSX from 'xlsx';
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
 * Parse Excel workbook with multiple sheets to annual plan format
 * Each sheet represents one calendar week (KW01-KW53)
 */
export const parseAnnualPlanData = (
  workbook: any,
  positionName: string
): AnnualPlanImportData => {
  const calendarWeeks: AnnualPlanImportData['calendar_weeks'] = {};
  
  console.log('Parsing workbook with sheets:', workbook.SheetNames);
  
  // Process each sheet (each sheet should be a calendar week)
  workbook.SheetNames.forEach((sheetName: string) => {
    console.log(`Processing sheet: ${sheetName}`);
    
    // Extract calendar week from sheet name
    const kwMatch = sheetName.match(/KW(\d{1,2})/i) || sheetName.match(/(\d{1,2})/);
    if (!kwMatch) {
      console.warn(`Skipping sheet ${sheetName} - no KW number found`);
      return;
    }
    
    const weekNumber = parseInt(kwMatch[1]);
    const calendarWeekKey = `KW${weekNumber.toString().padStart(2, '0')}`;
    
    // Get sheet data
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      console.warn(`Sheet ${sheetName} not found in workbook`);
      return;
    }
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];
    
    console.log(`Sheet ${sheetName} data:`, sheetData.slice(0, 10)); // Log first 10 rows
    
    const weekData: { [wocheGroup: string]: any } = {};
    
    // Find rows/columns with Woche data
    // Look for patterns like "Woche 1", "1", or similar in the data
    for (let rowIndex = 0; rowIndex < sheetData.length; rowIndex++) {
      const row = sheetData[rowIndex];
      if (!row || !Array.isArray(row)) continue;
      
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        if (!cell) continue;
        
        // Check if this cell contains a Woche identifier
        const wocheMatch = cell.toString().match(/(?:woche\s*)?(\d{1,2})/i);
        if (!wocheMatch) continue;
        
        const wocheNumber = parseInt(wocheMatch[1]);
        if (wocheNumber < 1 || wocheNumber > 15) continue;
        
        const wocheKey = `woche${wocheNumber}`;
        
        // Look for time data in adjacent cells or same row/column
        const timeData = findTimeDataNearCell(sheetData, rowIndex, colIndex);
        
        if (timeData) {
          weekData[wocheKey] = timeData;
          console.log(`Found time data for ${calendarWeekKey} ${wocheKey}:`, timeData);
        } else {
          weekData[wocheKey] = { is_off: true };
          console.log(`No time data found for ${calendarWeekKey} ${wocheKey}, marked as off`);
        }
      }
    }
    
    // If we found any Woche data, add it to calendar weeks
    if (Object.keys(weekData).length > 0) {
      calendarWeeks[calendarWeekKey] = weekData;
      console.log(`Added ${calendarWeekKey} with ${Object.keys(weekData).length} woche groups`);
    } else {
      console.warn(`No valid Woche data found in sheet ${sheetName}`);
    }
  });
  
  console.log('Final parsed calendar weeks:', Object.keys(calendarWeeks));
  
  return {
    position_name: positionName,
    calendar_weeks: calendarWeeks
  };
};

/**
 * Find time data near a cell containing Woche identifier
 */
const findTimeDataNearCell = (sheetData: any[][], rowIndex: number, colIndex: number): any => {
  // Search in adjacent cells for time patterns
  const searchOffsets = [
    [0, 1], [0, -1], [1, 0], [-1, 0], // Adjacent cells
    [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonal cells
  ];
  
  for (const [rowOffset, colOffset] of searchOffsets) {
    const checkRow = rowIndex + rowOffset;
    const checkCol = colIndex + colOffset;
    
    if (checkRow < 0 || checkRow >= sheetData.length) continue;
    if (checkCol < 0 || !sheetData[checkRow] || checkCol >= sheetData[checkRow].length) continue;
    
    const cell = sheetData[checkRow][checkCol];
    if (!cell) continue;
    
    const timeData = parseTimeCell(cell.toString());
    if (timeData) {
      return timeData;
    }
  }
  
  return null;
};

/**
 * Parse time data from a cell value
 */
const parseTimeCell = (cellValue: string): any => {
  if (!cellValue || cellValue.trim() === '' || cellValue.toUpperCase() === 'OFF') {
    return { is_off: true };
  }
  
  // Handle multiple time entries in one cell (e.g., "15:15 21:15 06:00")
  const timePattern = /(\d{1,2}):(\d{2})/g;
  const times = [];
  let match;
  
  while ((match = timePattern.exec(cellValue)) !== null) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      times.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }
  }
  
  if (times.length >= 2) {
    // Take first time as start, second as end
    return {
      start_time: times[0],
      end_time: times[1],
      shift_type: determineShiftType(times[0])
    };
  } else if (times.length === 1) {
    // Single time - assume 8-hour shift
    const startTime = times[0];
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = (hours + 8) % 24;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return {
      start_time: startTime,
      end_time: endTime,
      shift_type: determineShiftType(startTime)
    };
  }
  
  // Try to parse as time range (e.g., "06:00-14:00")
  const rangeMatch = cellValue.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  if (rangeMatch) {
    const startHours = parseInt(rangeMatch[1]);
    const startMinutes = parseInt(rangeMatch[2]);
    const endHours = parseInt(rangeMatch[3]);
    const endMinutes = parseInt(rangeMatch[4]);
    
    if (startHours >= 0 && startHours <= 23 && startMinutes >= 0 && startMinutes <= 59 &&
        endHours >= 0 && endHours <= 23 && endMinutes >= 0 && endMinutes <= 59) {
      const startTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      return {
        start_time: startTime,
        end_time: endTime,
        shift_type: determineShiftType(startTime)
      };
    }
  }
  
  return null;
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