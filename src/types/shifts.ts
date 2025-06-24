
export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface Shift {
  id?: string;
  user_id?: string;
  date: string; // ISO string format YYYY-MM-DD
  type: ShiftType;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShiftCalendarProps {
  shifts: Shift[];
  selectedDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
  onAddShift?: (date?: Date) => void;
  isLoading?: boolean;
  className?: string;
}

export interface ShiftFormData {
  type: ShiftType;
  notes: string;
}
