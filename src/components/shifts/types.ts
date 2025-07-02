// Re-export the unified types from the main types file
export type { ShiftType, Shift, ShiftCalendarProps, ShiftFormData } from '@/types/shifts';

// Keep legacy compatibility
export type AnalyticsPeriod = "week" | "month" | "quarter" | "year";

export interface ShiftStats {
  totalShifts: number;
  morningShifts: number;
  afternoonShifts: number;
  nightShifts: number;
  customShifts: number;
  totalHours: number;
  averagePerWeek: number;
}

export interface ShiftCalendarEvent {
  id?: string;
  user_id: string;
  date: string;
  type: ShiftType;
  start_time: string;
  end_time: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  start: Date;
  end: Date;
}

import type { ShiftType } from '@/types/shifts';
