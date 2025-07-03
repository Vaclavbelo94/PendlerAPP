
import React from 'react';
import { useUnifiedShiftsContainer } from '@/hooks/shifts/useUnifiedShiftsContainer';
import ShiftsFormSheets from './ShiftsFormSheets';
import ShiftsErrorHandler from './ShiftsErrorHandler';
import ShiftsLoadingSkeleton from './ShiftsLoadingSkeleton';
import ShiftCalendarContainer from './calendar/ShiftCalendarContainer';

const UnifiedShiftsMainContainer: React.FC = () => {
  const containerProps = useUnifiedShiftsContainer();
  
  const {
    shifts,
    isLoading,
    error,
    handleRetry,
    isAddSheetOpen,
    setIsAddSheetOpen,
    isEditSheetOpen,
    setIsEditSheetOpen,
    editingShift,
    setEditingShift,
    selectedDateForNewShift,
    handleAddShift,
    handleEditShift,
    openEditDialog,
    deleteShift,
    handleOpenAddSheet,
    handleOpenAddSheetWithDate,
    isSaving,
    isOnline,
    isSlowConnection
  } = containerProps;

  if (isLoading) {
    return <ShiftsLoadingSkeleton />;
  }

  if (error) {
    return (
      <ShiftsErrorHandler 
        error={error} 
        onRetry={handleRetry}
        isOnline={isOnline}
        isSlowConnection={isSlowConnection}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <ShiftCalendarContainer
        shifts={shifts}
        onEditShift={openEditDialog}
        onDeleteShift={deleteShift}
        onAddShift={handleOpenAddSheet}
        onAddShiftForDate={handleOpenAddSheetWithDate}
        isLoading={isLoading}
      />
      
      <ShiftsFormSheets
        isAddSheetOpen={isAddSheetOpen}
        setIsAddSheetOpen={setIsAddSheetOpen}
        isEditSheetOpen={isEditSheetOpen}
        setIsEditSheetOpen={setIsEditSheetOpen}
        editingShift={editingShift}
        setEditingShift={setEditingShift}
        onAddShift={handleAddShift}
        onEditShift={handleEditShift}
        isSaving={isSaving}
        selectedDateForNewShift={selectedDateForNewShift}
      />
    </div>
  );
};

export default UnifiedShiftsMainContainer;
