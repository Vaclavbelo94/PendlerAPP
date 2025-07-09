import { supabase } from '@/integrations/supabase/client';
import { validateScheduleData, ValidationResult } from './scheduleValidator';
import { toast } from 'sonner';

export interface ImportScheduleData {
  positionId: string;
  workGroupId: string;
  scheduleName: string;
  jsonData: any;
  fileName: string;
  importAllGroups?: boolean;
  selectedWoche?: number;
}

export interface ImportResult {
  success: boolean;
  scheduleId?: string | string[];
  importId?: string | string[];
  validation: ValidationResult;
  message: string;
  groupsProcessed?: number;
}

/**
 * Convert calendar week (KW) to actual dates for given year
 */
const getDateFromCalendarWeek = (year: number, week: string, dayName: string): string => {
  const weekNumber = parseInt(week.replace('KW', ''));
  const dayMap: { [key: string]: number } = {
    'Mo': 1, 'Di': 2, 'Mi': 3, 'Do': 4, 'Fr': 5, 'Sa': 6, 'So': 0
  };
  
  // ISO week calculation - more precise implementation
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7; // Convert Sunday from 0 to 7
  const firstMonday = new Date(jan4.getTime() - (jan4Day - 1) * 24 * 60 * 60 * 1000);
  
  const targetWeekStart = new Date(firstMonday.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
  const targetDay = new Date(targetWeekStart.getTime() + (dayMap[dayName] - 1) * 24 * 60 * 60 * 1000);
  
  return targetDay.toISOString().split('T')[0];
};

/**
 * Convert yearly Wechselschicht data for specific work group
 */
const convertWechselschichtForGroup = (data: any[], woche: number, year: number): any => {
  console.log(`Converting Wechselschicht data for group ${woche}, year ${year}`);
  
  const converted: any = {
    base_date: `${year}-01-01`,
    format_type: 'wechselschicht_30h',
    year: year,
    woche: woche,
    description: `Wechselschicht 30h - Pracovní skupina ${woche} (${year})`,
    calendar_weeks: {}
  };

  // Filter data for specific work group
  const groupData = data.filter(entry => entry.woche === woche);
  
  // Process each entry in the group
  groupData.forEach((entry: any) => {
    const actualDate = getDateFromCalendarWeek(year, entry.kalenderwoche, entry.den);
    
    // Only add entries with actual start times (not null)
    if (entry.start && entry.start !== null) {
      converted[actualDate] = {
        start_time: entry.start,
        end_time: entry.ende || entry.start, // Use ende field
        day: entry.den,
        woche: entry.woche,
        kalenderwoche: entry.kalenderwoche,
        pause: entry.pause || ''
      };
    }
  });
  
  // Store original calendar week data for reference
  converted.calendar_weeks[woche] = groupData;

  console.log(`Converted group ${woche} with ${Object.keys(converted).filter(k => k.match(/^\d{4}-\d{2}-\d{2}$/)).length} working days`);
  return converted;
};

/**
 * Convert different JSON formats to internal storage format
 */
const convertToStorageFormat = (data: any): any => {
  console.log('Converting data for storage...');
  
  // Handle Wechselschicht 30h format (calendar weeks)
  if (Array.isArray(data) && data.length > 0 && data[0].kalenderwoche) {
    console.log('Converting Wechselschicht 30h format for storage');
    
    const currentYear = new Date().getFullYear();
    
    // Group by woche to identify work groups
    const wochenGroups: { [key: number]: any[] } = {};
    data.forEach((entry: any) => {
      if (!wochenGroups[entry.woche]) {
        wochenGroups[entry.woche] = [];
      }
      wochenGroups[entry.woche].push(entry);
    });

    // Return the first group's data (for compatibility with single group import)
    const firstWoche = Math.min(...Object.keys(wochenGroups).map(Number));
    return convertWechselschichtForGroup(data, firstWoche, currentYear);
  }
  
  // Handle new shifts format (with shifts array)
  if (data.shifts && Array.isArray(data.shifts)) {
    console.log('Converting shifts format for storage');
    
    const converted: any = {
      base_date: data.valid_from || new Date().toISOString().split('T')[0],
      woche: data.woche || 1,
      position: data.position || 'Sortierer',
      description: data.description || `Směny pro pozici Sortierer – Woche ${data.woche || 'N/A'}`
    };

    // Convert shifts to date-keyed format
    data.shifts.forEach((shift: any) => {
      if (shift.date) {
        converted[shift.date] = {
          start_time: shift.start || shift.start_time,
          end_time: shift.end || shift.end_time,
          day: shift.day,
          woche: data.woche // Use woche from root level
        };
      }
    });

    console.log('Converted shifts to storage format:', converted);
    return converted;
  }
  
  // Handle entries format (previous format)
  if (data.entries && Array.isArray(data.entries)) {
    const converted: any = {
      base_date: data.base_date || new Date().toISOString().split('T')[0],
      woche: null,
      position: data.position,
      description: data.description
    };

    // Convert entries to date-keyed format
    data.entries.forEach((entry: any) => {
      if (entry.date) {
        // Extract Woche from first valid entry
        if (converted.woche === null && entry.woche) {
          converted.woche = entry.woche;
        }

        converted[entry.date] = {
          start_time: entry.start || entry.start_time,
          end_time: entry.end || entry.end_time,
          day: entry.day,
          woche: entry.woche
        };
      }
    });

    console.log('Converted entries to storage format:', converted);
    return converted;
  }

  // Already in internal format
  return data;
};

/**
 * Verify user has admin privileges
 */
const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('No authenticated user found');
      return false;
    }

    console.log('Checking admin access for user:', user.email);

    // First check if this is the DHL admin email
    if (user.email === 'admin_dhl@pendlerapp.com') {
      console.log('User is DHL admin by email');
      return true;
    }

    // Check database for admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error checking admin status:', profileError);
      return false;
    }

    const isAdmin = profile?.is_admin || false;
    console.log('User admin status from database:', isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return false;
  }
};

/**
 * Import DHL schedule from JSON data - supports batch import for all groups
 */
export const importDHLSchedule = async (data: ImportScheduleData): Promise<ImportResult> => {
  console.log('=== DHL SCHEDULE IMPORT START ===');
  console.log('Import data:', data);

  // Verify admin access first
  const hasAdminAccess = await verifyAdminAccess();
  if (!hasAdminAccess) {
    console.error('Access denied: User does not have admin privileges');
    return {
      success: false,
      validation: { isValid: false, errors: [], warnings: [], summary: { totalDays: 0, totalShifts: 0, dateRange: null, detectedWoche: null } },
      message: 'Access denied: Admin privileges required for importing schedules'
    };
  }

  // Validate the JSON data first
  const validation = await validateScheduleData(data.jsonData, data.fileName);
  console.log('Validation result:', validation);

  if (!validation.isValid) {
    console.error('Validation failed:', validation.errors);
    return {
      success: false,
      validation,
      message: `Import failed: ${validation.errors.map(e => e.message).join(', ')}`
    };
  }

  try {
    // Check if this is Wechselschicht format and if importing all groups
    const isWechselschicht = Array.isArray(data.jsonData) && data.jsonData.length > 0 && data.jsonData[0].kalenderwoche;
    
    if (isWechselschicht && data.importAllGroups) {
      console.log('Starting batch import for all Wechselschicht groups');
      return await importAllWechselschichtGroups(data, validation);
    } else if (isWechselschicht && data.selectedWoche) {
      console.log(`Importing single Wechselschicht group: ${data.selectedWoche}`);
      return await importSingleWechselschichtGroup(data, validation, data.selectedWoche);
    } else {
      // Regular import for non-Wechselschicht formats
      return await importSingleSchedule(data, validation);
    }
  } catch (error) {
    console.error('Import error:', error);
    return await handleImportError(error, validation, data);
  }
};

/**
 * Import all 15 Wechselschicht groups at once
 */
const importAllWechselschichtGroups = async (data: ImportScheduleData, validation: ValidationResult): Promise<ImportResult> => {
  const currentYear = new Date().getFullYear();
  const scheduleIds: string[] = [];
  const importIds: string[] = [];
  let groupsProcessed = 0;

  // Get current user for logging
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  // Import each group (1-15)
  for (let woche = 1; woche <= 15; woche++) {
    try {
      console.log(`Processing group ${woche}/15`);
      
      // Convert data for this specific group
      const storageData = convertWechselschichtForGroup(data.jsonData, woche, currentYear);
      
      // Skip if no working days for this group
      const workingDays = Object.keys(storageData).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/)).length;
      if (workingDays === 0) {
        console.log(`Skipping group ${woche} - no working days found`);
        continue;
      }

      // Insert schedule for this group
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('dhl_shift_schedules')
        .insert({
          position_id: data.positionId,
          work_group_id: data.workGroupId,
          schedule_name: `${data.scheduleName} - Skupina ${woche}`,
          schedule_data: storageData,
          base_date: `${currentYear}-01-01`,
          base_woche: woche,
          is_active: true
        })
        .select('id')
        .single();

      if (scheduleError) {
        console.error(`Error inserting schedule for group ${woche}:`, scheduleError);
        continue;
      }

      scheduleIds.push(scheduleData.id);
      groupsProcessed++;

      // Log the import
      const metadata = {
        validation_summary: validation.summary,
        import_timestamp: new Date().toISOString(),
        woche: woche,
        working_days: workingDays,
        batch_import: true
      };

      const { data: importData, error: importError } = await supabase
        .from('dhl_schedule_imports')
        .insert({
          admin_user_id: user.id,
          imported_schedule_id: scheduleData.id,
          file_name: `${data.fileName} (Skupina ${woche})`,
          import_status: 'success',
          records_processed: workingDays,
          metadata: metadata
        })
        .select('id')
        .single();

      if (!importError && importData) {
        importIds.push(importData.id);
      }

      console.log(`Group ${woche} imported successfully with ${workingDays} working days`);
    } catch (error) {
      console.error(`Error processing group ${woche}:`, error);
    }
  }

  console.log(`=== BATCH IMPORT COMPLETE: ${groupsProcessed}/15 groups processed ===`);

  return {
    success: groupsProcessed > 0,
    scheduleId: scheduleIds,
    importId: importIds,
    validation,
    groupsProcessed,
    message: `Batch import completed: ${groupsProcessed} groups imported successfully`
  };
};

/**
 * Import single Wechselschicht group
 */
const importSingleWechselschichtGroup = async (data: ImportScheduleData, validation: ValidationResult, woche: number): Promise<ImportResult> => {
  const currentYear = new Date().getFullYear();
  
  // Convert data for specific group
  const storageData = convertWechselschichtForGroup(data.jsonData, woche, currentYear);
  
  return await importSingleSchedule({
    ...data,
    scheduleName: `${data.scheduleName} - Skupina ${woche}`,
    jsonData: storageData
  }, validation);
};

/**
 * Import single schedule (non-batch)
 */
const importSingleSchedule = async (data: ImportScheduleData, validation: ValidationResult): Promise<ImportResult> => {
  // Convert to storage format
  const storageData = convertToStorageFormat(data.jsonData);
  
  // Extract base information from converted data
  const baseDate = storageData.base_date || new Date().toISOString().split('T')[0];
  const baseWoche = storageData.woche || 1;

  console.log('Inserting schedule data:', {
    positionId: data.positionId,
    workGroupId: data.workGroupId,
    scheduleName: data.scheduleName,
    baseDate,
    baseWoche
  });

  // Insert the schedule data
  const { data: scheduleData, error: scheduleError } = await supabase
    .from('dhl_shift_schedules')
    .insert({
      position_id: data.positionId,
      work_group_id: data.workGroupId,
      schedule_name: data.scheduleName,
      schedule_data: storageData,
      base_date: baseDate,
      base_woche: baseWoche,
      is_active: true
    })
    .select('id')
    .single();

  if (scheduleError) {
    console.error('Error inserting schedule:', scheduleError);
    throw new Error(`Failed to save schedule: ${scheduleError.message}`);
  }

  console.log('Schedule inserted with ID:', scheduleData.id);

  // Get current user ID for logging
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  // Prepare metadata with proper typing for JSON field
  const metadata = {
    validation_summary: {
      totalDays: validation.summary.totalDays,
      totalShifts: validation.summary.totalShifts,
      dateRange: validation.summary.dateRange ? `${validation.summary.dateRange.start} - ${validation.summary.dateRange.end}` : '',
      detectedWoche: validation.summary.detectedWoche
    },
    import_timestamp: new Date().toISOString(),
    warnings: validation.warnings.map(warning => ({
      field: warning.field,
      message: warning.message,
      line: warning.line || null
    }))
  };

  // Log the import
  const { data: importData, error: importError } = await supabase
    .from('dhl_schedule_imports')
    .insert({
      admin_user_id: user.id,
      imported_schedule_id: scheduleData.id,
      file_name: data.fileName,
      import_status: 'success',
      records_processed: validation.summary.totalShifts,
      metadata: metadata
    })
    .select('id')
    .single();

  if (importError) {
    console.error('Error logging import:', importError);
    // Don't fail the entire import for logging errors
  }

  console.log('=== DHL SCHEDULE IMPORT SUCCESS ===');
  console.log('Schedule ID:', scheduleData.id);
  console.log('Import ID:', importData?.id);

  return {
    success: true,
    scheduleId: scheduleData.id,
    importId: importData?.id,
    validation,
    message: `Successfully imported schedule with ${validation.summary.totalShifts} shifts`
  };
};

/**
 * Handle import errors with proper logging
 */
const handleImportError = async (error: any, validation: ValidationResult, data: ImportScheduleData): Promise<ImportResult> => {
  console.error('Import error:', error);
  
  // Log failed import
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const errorMetadata = {
        validation_summary: {
          totalDays: validation.summary.totalDays,
          totalShifts: validation.summary.totalShifts,
          dateRange: validation.summary.dateRange ? `${validation.summary.dateRange.start} - ${validation.summary.dateRange.end}` : '',
          detectedWoche: validation.summary.detectedWoche
        },
        import_timestamp: new Date().toISOString(),
        error_details: error instanceof Error ? error.message : 'Unknown error'
      };

      await supabase
        .from('dhl_schedule_imports')
        .insert({
          admin_user_id: user.id,
          imported_schedule_id: null,
          file_name: data.fileName,
          import_status: 'failed',
          records_processed: 0,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          metadata: errorMetadata
        });
    }
  } catch (logError) {
    console.error('Error logging failed import:', logError);
  }

  return {
    success: false,
    validation,
    message: error instanceof Error ? error.message : 'Import failed'
  };
};

/**
 * Get all imported schedules for admin view
 */
export const getDHLSchedules = async () => {
  console.log('Fetching DHL schedules...');

  const { data, error } = await supabase
    .from('dhl_shift_schedules')
    .select(`
      *,
      dhl_positions(id, name, position_type),
      dhl_work_groups(id, name, week_number)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }

  console.log('Fetched schedules:', data);
  return data || [];
};

/**
 * Get import history for admin monitoring
 */
export const getImportHistory = async () => {
  console.log('Fetching import history...');

  const { data, error } = await supabase
    .from('dhl_schedule_imports')
    .select(`
      *,
      dhl_shift_schedules(id, schedule_name, position_id, work_group_id)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching import history:', error);
    throw error;
  }

  return data || [];
};

/**
 * Delete a schedule and mark it as inactive
 */
export const deleteSchedule = async (scheduleId: string) => {
  console.log('Deleting schedule:', scheduleId);

  const { error } = await supabase
    .from('dhl_shift_schedules')
    .update({ is_active: false })
    .eq('id', scheduleId);

  if (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }

  toast.success('Schedule deleted successfully');
};

/**
 * Update schedule data
 */
export const updateSchedule = async (scheduleId: string, updates: Partial<ImportScheduleData>) => {
  console.log('Updating schedule:', scheduleId, updates);

  const updateData: any = {};
  
  if (updates.scheduleName) {
    updateData.schedule_name = updates.scheduleName;
  }
  
  if (updates.jsonData) {
    const storageData = convertToStorageFormat(updates.jsonData);
    updateData.schedule_data = storageData;
    // Re-extract base information
    updateData.base_date = storageData.base_date || updateData.base_date;
    updateData.base_woche = storageData.woche || updateData.base_woche;
  }

  const { error } = await supabase
    .from('dhl_shift_schedules')
    .update(updateData)
    .eq('id', scheduleId);

  if (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }

  toast.success('Schedule updated successfully');
};