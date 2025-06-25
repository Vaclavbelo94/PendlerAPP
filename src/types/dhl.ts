// DHL System Types

export type DHLPositionType = 'technik' | 'rangierer' | 'verlader' | 'sortierer' | 'fahrer' | 'other';

export interface DHLPosition {
  id: string;
  name: string;
  position_type: DHLPositionType;
  description?: string;
  hourly_rate?: number;
  requirements?: string[];
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

// Extended UserDHLAssignment with reference tracking
export interface ExtendedUserDHLAssignment extends UserDHLAssignment {
  reference_date?: string;
  reference_woche?: number;
}
