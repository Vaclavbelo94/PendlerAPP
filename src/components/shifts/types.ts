
export type ShiftType = "morning" | "afternoon" | "night";

export interface Shift {
  id: string;
  userId: string;
  user_id?: string; // For database compatibility
  date: string; // Changed from Date to string for consistency
  type: ShiftType;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export type AnalyticsPeriod = "week" | "month" | "quarter" | "year";

export interface ShiftStats {
  totalShifts: number;
  morningShifts: number;
  afternoonShifts: number;
  nightShifts: number;
  totalHours: number;
  averagePerWeek: number;
}

export interface ShiftCalendarEvent extends Shift {
  title: string;
  start: Date;
  end: Date;
}
