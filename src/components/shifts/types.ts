// Re-export the unified types from the main types file
export { ShiftType, Shift, ShiftCalendarProps, ShiftFormData } from '@/types/shifts';

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

export interface ShiftCalendarEvent extends Shift {
  title: string;
  start: Date;
  end: Date;
}
