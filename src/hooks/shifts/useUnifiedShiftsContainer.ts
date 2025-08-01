
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { useRefactoredShiftsManagement } from './useRefactoredShiftsManagement';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { Shift } from './useShiftsCRUD';

export const useUnifiedShiftsContainer = () => {
  const { user } = useAuth();
  const { isOnline, isSlowConnection } = useOptimizedNetworkStatus();
  
  // Always call hooks in the same order - pass null for user ID if no user
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id || null);
  
  const [isInitialized, setIsInitialized] = useState(true);
  const [activeSection, setActiveSection] = useState('calendar');
  const [isChanging, setIsChanging] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDateForNewShift, setSelectedDateForNewShift] = useState<Date | null>(null);
  
  // Critical fix: Initialize with undefined to ensure no date is initially selected
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(undefined);

  // Always call this hook - pass null if no user
  const {
    shifts,
    isLoading,
    isSaving,
    error,
    addShift: addShiftOriginal,
    updateShift: updateShiftOriginal,
    deleteShift,
    refreshShifts
  } = useRefactoredShiftsManagement(user?.id || null);

  // Check if user is DHL employee with assignment
  const isDHLUser = useMemo(() => {
    if (!user) return false;
    return isDHLEmployee(user);
  }, [user]);
  
  const hasDHLAssignment = useMemo(() => {
    return isDHLUser && !!userAssignment;
  }, [isDHLUser, userAssignment]);

  const handleSectionChange = useCallback((section: string) => {
    setIsChanging(true);
    setActiveSection(section);
    setTimeout(() => setIsChanging(false), 150);
  }, []);

  const handleAddShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<void> => {
    if (!user?.id) {
      console.warn('Cannot add shift: no user ID');
      return;
    }
    
    const result = await addShiftOriginal(shiftData);
    if (result) {
      setIsAddSheetOpen(false);
      setSelectedDateForNewShift(null);
    }
  }, [addShiftOriginal, user?.id]);

  const handleEditShift = useCallback(async (shiftData: Shift): Promise<void> => {
    if (!user?.id) {
      console.warn('Cannot edit shift: no user ID');
      return;
    }
    
    const result = await updateShiftOriginal(shiftData);
    if (result) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  }, [updateShiftOriginal, user?.id]);

  // Universal handler that routes to add or edit based on the isEdit flag
  const handleShiftSubmit = useCallback(async (shiftData: any, isEdit: boolean): Promise<void> => {
    if (isEdit) {
      await handleEditShift(shiftData);
    } else {
      await handleAddShift(shiftData);
    }
  }, [handleAddShift, handleEditShift]);

  const openEditDialog = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  }, []);

  const handleRetry = useCallback(async () => {
    await refreshShifts();
  }, [refreshShifts]);

  const handleOpenAddSheet = useCallback(() => {
    console.log('Opening add sheet - calendarSelectedDate:', calendarSelectedDate);
    setSelectedDateForNewShift(calendarSelectedDate || new Date());
    setIsAddSheetOpen(true);
  }, [calendarSelectedDate]);

  const handleOpenAddSheetWithDate = useCallback((date: Date) => {
    console.log('Opening add sheet with specific date:', date);
    setSelectedDateForNewShift(date);
    setCalendarSelectedDate(date);
    setIsAddSheetOpen(true);
  }, []);

  // Critical fix: This callback ensures clean date selection
  const handleCalendarDateChange = useCallback((date: Date | undefined) => {
    console.log('Calendar date changing from:', calendarSelectedDate, 'to:', date);
    
    // Always update the calendar state
    setCalendarSelectedDate(date);
    
    // Update selectedDateForNewShift when date is selected
    if (date) {
      setSelectedDateForNewShift(date);
    } else {
      setSelectedDateForNewShift(null);
    }
  }, [calendarSelectedDate]);

  return {
    user,
    isInitialized,
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
    shifts,
    isLoading: isLoading || isDHLDataLoading,
    error,
    isSaving,
    isChanging,
    handleSectionChange,
    handleAddShift,
    handleEditShift,
    handleShiftSubmit,
    openEditDialog,
    handleRetry,
    handleOpenAddSheet,
    handleOpenAddSheetWithDate,
    handleCalendarDateChange,
    deleteShift,
    // DHL specific data
    isDHLUser,
    hasDHLAssignment,
    userAssignment
  };
};
