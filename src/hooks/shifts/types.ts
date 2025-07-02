
export type { ShiftType, Shift, ShiftFormData } from '@/types/shifts';

import type { Shift } from '@/types/shifts';

export interface UseShiftsManagementReturn {
  shifts: Shift[];
  selectedShift: Shift | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  retryCount: number;
  addShift: (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Shift | null>;
  updateShift: (shiftData: Shift) => Promise<Shift | null>;
  deleteShift: (shiftId: string) => Promise<void>;
  selectShift: (shiftId: string) => void;
  retryLastOperation: () => Promise<void>;
}
