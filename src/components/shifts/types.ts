
// Defines the types of shifts that can be scheduled
export type ShiftType = "morning" | "afternoon" | "night";

// Defines the structure of a shift entry
export interface Shift {
  id: string;
  date: Date;
  type: ShiftType;
  userId: string;
  notes?: string;
}

// Period for analytics
export type AnalyticsPeriod = "week" | "month" | "year";
