
export type ShiftType = "morning" | "afternoon" | "night";

export interface Shift {
  id: string;
  date: Date;
  type: ShiftType;
  notes: string;
  userId: string;
}

export interface ShiftData {
  date: string;
  type: ShiftType;
  notes: string;
  user_id: string;
}

export interface EnhancedShiftData extends ShiftData {
  synced_at?: string;
  device_id?: string;
}

export interface ShiftCalendarModifiers {
  hasShift: (date: Date) => boolean;
}

export interface ShiftFormData {
  selectedDate: Date | undefined;
  shiftType: ShiftType;
  shiftNotes: string;
}

export interface ShiftOperationResult {
  savedShift: any;
  isUpdate: boolean;
}

export interface SyncQueueItem {
  id: string;
  action: string;
  data: any;
  timestamp: string;
  retries: number;
}

export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year';
