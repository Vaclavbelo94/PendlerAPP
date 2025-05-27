
import { useState, useCallback } from 'react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { useDebouncedNavigation } from '@/hooks/useDebouncedNavigation';

export const useShiftsContainer = () => {
  const { user, isInitialized } = useSimplifiedAuth();
  const { isOnline, isSlowConnection } = useOptimizedNetworkStatus();
  const [activeSection, setActiveSection] = useState('calendar');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const {
    shifts,
    isLoading,
    error,
    addShift,
    updateShift,
    deleteShift,
    isSaving,
    refreshShifts
  } = useOptimizedShiftsManagement(user?.id);

  // Use debounced navigation to prevent rapid switching
  const { handleSectionChange, isChanging } = useDebouncedNavigation({
    onSectionChange: setActiveSection,
    debounceMs: 200
  });

  // Stabilized callbacks
  const handleAddShift = useCallback(async (formData) => {
    const newShift = await addShift(formData);
    if (newShift !== null) {
      setIsAddSheetOpen(false);
    }
  }, [addShift]);

  const handleEditShift = useCallback(async (formData) => {
    if (!editingShift) return;
    
    const updatedShift = await updateShift({ ...formData, id: editingShift.id });
    if (updatedShift !== null) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  }, [editingShift, updateShift]);

  const openEditDialog = useCallback((shift) => {
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
    // Auth & Network
    user,
    isInitialized,
    isOnline,
    isSlowConnection,
    
    // State
    activeSection,
    isAddSheetOpen,
    setIsAddSheetOpen,
    isEditSheetOpen,
    setIsEditSheetOpen,
    editingShift,
    setEditingShift,
    
    // Shifts data
    shifts,
    isLoading,
    error,
    isSaving,
    isChanging,
    
    // Handlers
    handleSectionChange,
    handleAddShift,
    handleEditShift,
    openEditDialog,
    handleRetry,
    handleOpenAddSheet,
    deleteShift
  };
};
