
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { useSimplifiedShiftsManagement } from './useSimplifiedShiftsManagement';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { Shift } from './useShiftsCRUD';
import { ShiftFormData } from '@/types/shifts';

export const useUnifiedShiftsContainer = () => {
  const { user } = useAuth();
  const { isOnline, isSlowConnection } = useOptimizedNetworkStatus();
  
  // Safely get user ID
  const userId = user?.id || null;
  
  // Always call hooks in the same order - pass null for user ID if no user
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(userId);
  
  const [activeSection, setActiveSection] = useState('calendar');
  const [isChanging, setIsChanging] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDateForNewShift, setSelectedDateForNewShift] = useState<Date | undefined>(undefined);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(undefined);

  // Use simplified shifts management
  const {
    shifts,
    isLoading: shiftsLoading,
    isSaving,
    error,
    addShift: addShiftOriginal,
    updateShift: updateShiftOriginal,
    deleteShift,
    refreshShifts
  } = useSimplifiedShiftsManagement(userId);

  // Memoize expensive calculations to prevent re-renders
  const isDHLUser = useMemo(() => {
    return user ? isDHLEmployee(user) : false;
  }, [user]);
  
  const hasDHLAssignment = useMemo(() => {
    return isDHLUser && !!userAssignment;
  }, [isDHLUser, userAssignment]);

  // Combine loading states
  const isLoading = shiftsLoading || isDHLDataLoading;

  const handleSectionChange = useCallback((section: string) => {
    setIsChanging(true);
    setActiveSection(section);
    setTimeout(() => setIsChanging(false), 150);
  }, []);

  const handleAddShift = useCallback(async (formData: ShiftFormData): Promise<void> => {
    if (!userId || !selectedDateForNewShift) return;
    
    const shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      date: selectedDateForNewShift.toISOString().split('T')[0],
      type: formData.type,
      notes: formData.notes || undefined
    };
    
    const result = await addShiftOriginal(shiftData);
    if (result) {
      setIsAddSheetOpen(false);
      setSelectedDateForNewShift(undefined);
    }
  }, [addShiftOriginal, userId, selectedDateForNewShift]);

  const handleEditShift = useCallback(async (formData: ShiftFormData): Promise<void> => {
    if (!userId || !editingShift) return;
    
    const shiftData: Shift = {
      ...editingShift,
      type: formData.type,
      notes: formData.notes || undefined
    };
    
    const result = await updateShiftOriginal(shiftData);
    if (result) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  }, [updateShiftOriginal, userId, editingShift]);

  const openEditDialog = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  }, []);

  const handleRetry = useCallback(async () => {
    await refreshShifts();
  }, [refreshShifts]);

  const handleOpenAddSheet = useCallback(() => {
    setSelectedDateForNewShift(new Date());
    setIsAddSheetOpen(true);
  }, []);

  const handleOpenAddSheetWithDate = useCallback((date: Date) => {
    setSelectedDateForNewShift(date);
    setIsAddSheetOpen(true);
  }, []);

  const handleCalendarDateChange = useCallback((date: Date | undefined) => {
    setCalendarSelectedDate(date);
  }, []);

  return {
    user,
    isOnline,
    isSlowConnection,
    activeSection,
    isAddSheetOpen,
    setIsAddSheetOpen,
    isEditSheetOpen,
    setIsEditSheetOpen,
    editingShift,
    setEditingShift,
    selectedDateForNewShift,
    calendarSelectedDate,
    handleCalendarDateChange,
    shifts,
    isLoading,
    error,
    isSaving,
    isChanging,
    handleSectionChange,
    handleAddShift,
    handleEditShift,
    openEditDialog,
    handleRetry,
    handleOpenAddSheet,
    handleOpenAddSheetWithDate,
    deleteShift,
    // DHL specific data
    isDHLUser,
    hasDHLAssignment,
    userAssignment
  };
};
