
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { useRefactoredShiftsManagement } from '@/hooks/shifts/useRefactoredShiftsManagement';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

export const useUnifiedShiftsContainer = () => {
  const { user } = useAuth();
  const { isOnline, isSlowConnection } = useOptimizedNetworkStatus();
  
  // Always call hooks in the same order - don't conditionally call them
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id || null);
  
  const [isInitialized, setIsInitialized] = useState(true);
  const [activeSection, setActiveSection] = useState('calendar');
  const [isChanging, setIsChanging] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

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

  // Memoize expensive calculations to prevent re-renders
  const isDHLUser = useMemo(() => {
    return user ? isDHLEmployee(user) : false;
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
    if (!user?.id) return;
    const result = await addShiftOriginal(shiftData);
    if (result) {
      setIsAddSheetOpen(false);
    }
  }, [addShiftOriginal, user?.id]);

  const handleEditShift = useCallback(async (shiftData: Shift): Promise<void> => {
    if (!user?.id) return;
    const result = await updateShiftOriginal(shiftData);
    if (result) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  }, [updateShiftOriginal, user?.id]);

  const openEditDialog = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  }, []);

  const handleRetry = useCallback(async () => {
    await refreshShifts();
  }, [refreshShifts]);

  const handleOpenAddSheet = useCallback(() => {
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
    shifts,
    isLoading: isLoading || isDHLDataLoading,
    error,
    isSaving,
    isChanging,
    handleSectionChange,
    handleAddShift,
    handleEditShift,
    openEditDialog,
    handleRetry,
    handleOpenAddSheet,
    deleteShift,
    // DHL specific data
    isDHLUser,
    hasDHLAssignment,
    userAssignment
  };
};
