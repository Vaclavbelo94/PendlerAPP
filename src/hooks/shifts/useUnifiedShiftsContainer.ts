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
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id);
  
  const [isInitialized, setIsInitialized] = useState(true);
  const [activeSection, setActiveSection] = useState('calendar');
  const [isChanging, setIsChanging] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDateForNewShift, setSelectedDateForNewShift] = useState<Date | null>(null);

  const {
    shifts,
    isLoading,
    isSaving,
    error,
    addShift: addShiftOriginal,
    updateShift: updateShiftOriginal,
    deleteShift,
    refreshShifts
  } = useRefactoredShiftsManagement(user?.id);

  // Check if user is DHL employee with assignment
  const isDHLUser = useMemo(() => isDHLEmployee(user), [user]);
  const hasDHLAssignment = useMemo(() => isDHLUser && !!userAssignment, [isDHLUser, userAssignment]);

  const handleSectionChange = useCallback((section: string) => {
    setIsChanging(true);
    setActiveSection(section);
    setTimeout(() => setIsChanging(false), 150);
  }, []);

  const handleAddShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<void> => {
    const result = await addShiftOriginal(shiftData);
    if (result) {
      setIsAddSheetOpen(false);
      setSelectedDateForNewShift(null);
    }
  }, [addShiftOriginal]);

  const handleEditShift = useCallback(async (shiftData: Shift): Promise<void> => {
    const result = await updateShiftOriginal(shiftData);
    if (result) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  }, [updateShiftOriginal]);

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
    setSelectedDateForNewShift(null);
    setIsAddSheetOpen(true);
  }, []);

  const handleOpenAddSheetWithDate = useCallback((date: Date) => {
    console.log('Setting selected date for new shift:', date);
    setSelectedDateForNewShift(date);
    setIsAddSheetOpen(true);
  }, []);

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
    deleteShift,
    // DHL specific data
    isDHLUser,
    hasDHLAssignment,
    userAssignment
  };
};
