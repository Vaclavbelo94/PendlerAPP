
export type ShiftType = 'morning' | 'afternoon' | 'night' | 'custom';

export interface Shift {
  id?: string;
  user_id: string;
  date: string; // ISO string format YYYY-MM-DD
  type: ShiftType;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
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
  onAddShiftForDate?: (date: Date) => void;
  isLoading?: boolean;
  className?: string;
}

export interface ShiftFormData {
  type: ShiftType;
  start_time: string;
  end_time: string;
  notes?: string;
}
