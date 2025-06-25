
export interface Shift {
  id?: string;
  user_id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // DHL specific fields
  dhl_position_id?: string;
  dhl_work_group_id?: string;
  is_dhl_managed?: boolean;
  dhl_override?: boolean;
  original_dhl_data?: any;
}

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
