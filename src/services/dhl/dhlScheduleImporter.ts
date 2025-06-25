
import { supabase } from '@/integrations/supabase/client';
import { validateScheduleData, ValidationResult } from './scheduleValidator';
import { toast } from 'sonner';

export interface ImportScheduleData {
  positionId: string;
  workGroupId: string;
  scheduleName: string;
  jsonData: any;
  fileName: string;
}

export interface ImportResult {
  success: boolean;
  scheduleId?: string;
  importId?: string;
  validation: ValidationResult;
  message: string;
}

/**
 * Import DHL schedule from JSON data
 */
export const importDHLSchedule = async (data: ImportScheduleData): Promise<ImportResult> => {
  console.log('=== DHL SCHEDULE IMPORT START ===');
  console.log('Import data:', data);

  // Validate the JSON data first
  const validation = validateScheduleData(data.jsonData, data.fileName);
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
    // Extract base information from JSON
    const baseDate = data.jsonData.base_date || new Date().toISOString().split('T')[0];
    const baseWoche = data.jsonData.woche || 1;

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
        schedule_data: data.jsonData,
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

    // Get current user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    // Prepare metadata with proper typing for JSON field
    const metadata = {
      validation_summary: {
        totalDays: validation.summary.totalDays,
        totalShifts: validation.summary.totalShifts,
        dateRange: validation.summary.dateRange,
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

  } catch (error) {
    console.error('Import error:', error);
    
    // Log failed import
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const errorMetadata = {
          validation_summary: {
            totalDays: validation.summary.totalDays,
            totalShifts: validation.summary.totalShifts,
            dateRange: validation.summary.dateRange,
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
  }
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
    updateData.schedule_data = updates.jsonData;
    // Re-extract base information
    updateData.base_date = updates.jsonData.base_date || updateData.base_date;
    updateData.base_woche = updates.jsonData.woche || updateData.base_woche;
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
