
// DHL System Types

export type DHLPositionType = 'technik' | 'rangierer' | 'verlader' | 'sortierer' | 'fahrer' | 'other';

export interface DHLPosition {
  id: string;
  name: string;
  position_type: DHLPositionType;
  description?: string;
  hourly_rate?: number;
  requirements?: string[];
  cycle_weeks?: number[]; // Array of week numbers (1-15) that this position has in its cycle
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DHLWorkGroup {
  id: string;
  week_number: number; // 1-15
  name: string; // "Woche 1", "Woche 2", etc.
  description?: string;
  shift_pattern?: any; // JSONB
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DHLShiftTemplate {
  id: string;
  position_id: string;
  work_group_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, etc.
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  break_duration: number; // minutes
  is_required: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  position?: DHLPosition;
  work_group?: DHLWorkGroup;
}

export interface DHLNotification {
  id: string;
  user_id: string;
  shift_id?: string;
  notification_type: 'shift_assigned' | 'shift_changed' | 'shift_cancelled';
  title: string;
  message: string;
  is_read: boolean;
  metadata?: any; // JSONB
  created_at: string;
  updated_at: string;
}

export interface UserDHLAssignment {
  id: string;
  user_id: string;
  dhl_position_id: string;
  dhl_work_group_id: string;
  assigned_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  current_woche?: number; // Simplified: user's current Woche (1-15)
  reference_date?: string; // Legacy field
  reference_woche?: number; // Legacy field
  // Relations
  dhl_position?: DHLPosition;
  dhl_work_group?: DHLWorkGroup;
}

// Extended Shift type with DHL fields
export interface DHLShift {
  id?: string;
  user_id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  // DHL specific fields
  dhl_position_id?: string;
  dhl_work_group_id?: string;
  is_dhl_managed?: boolean;
  dhl_override?: boolean;
  original_dhl_data?: any;
  created_at?: string;
  updated_at?: string;
  // Relations
  dhl_position?: DHLPosition;
  dhl_work_group?: DHLWorkGroup;
}

// DHL Setup form data
export interface DHLSetupFormData {
  position_id: string;
  work_group_id: string;
}

// DHL Import data structure
export interface DHLImportData {
  position: string;
  work_group: number;
  shifts: {
    date: string;
    start_time: string;
    end_time: string;
    type: 'morning' | 'afternoon' | 'night';
    is_required?: boolean;
  }[];
}

// DHL Analytics
export interface DHLAnalytics {
  total_dhl_users: number;
  total_dhl_shifts: number;
  position_distribution: Record<DHLPositionType, number>;
  work_group_distribution: Record<number, number>;
  monthly_hours: number;
  override_count: number;
}

// New types for DHL Import System
export interface DHLShiftSchedule {
  id: string;
  position_id: string;
  work_group_id: string;
  schedule_name: string;
  schedule_data: any; // JSONB
  base_date: string;
  base_woche: number;
  calendar_week?: number; // 1-53 for annual plans
  annual_plan?: boolean; // true for annual rotational plans
  woche_group?: number; // 1-15 for which woche group this schedule is for
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  dhl_position?: DHLPosition;
  dhl_work_group?: DHLWorkGroup;
}

export interface DHLScheduleImport {
  id: string;
  admin_user_id: string;
  imported_schedule_id?: string;
  file_name: string;
  import_status: 'success' | 'failed' | 'processing';
  records_processed: number;
  error_message?: string;
  metadata?: any; // JSONB
  created_at: string;
  // Relations
  dhl_shift_schedule?: DHLShiftSchedule;
}

export interface WocheCalculationResult {
  currentWoche: number;
  weekStartDate: Date;
  weekEndDate: Date;
  cyclePosition: number;
  calendarWeek: number; // Current calendar week (1-53)
  rotatedWoche: number; // User's rotated woche position for this calendar week
}

export interface DHLImportValidation {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    line?: number;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    line?: number;
  }>;
  summary: {
    totalDays: number;
    totalShifts: number;
    dateRange: { start: string; end: string } | null;
    detectedWoche: number | null;
  };
}

// Extended UserDHLAssignment with current woche tracking
export interface ExtendedUserDHLAssignment extends UserDHLAssignment {
  current_woche?: number;
}

// Annual plan import data structure
export interface AnnualPlanImportData {
  position_name: string;
  calendar_weeks: {
    [calendarWeek: string]: { // KW01, KW02, etc.
      [wocheGroup: string]: { // woche1, woche2, etc.
        start_time?: string;
        end_time?: string;
        shift_type?: 'morning' | 'afternoon' | 'night';
        is_off?: boolean; // day off
      };
    };
  };
}

// Calendar week calculation
export interface CalendarWeekInfo {
  calendarWeek: number; // 1-53
  year: number;
  weekStartDate: Date;
  weekEndDate: Date;
}
