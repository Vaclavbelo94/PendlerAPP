
import React from 'react';
import { useUnifiedShiftsContainer } from '@/hooks/shifts/useUnifiedShiftsContainer';
import ShiftsContentRenderer from './ShiftsContentRenderer';
import ShiftsFormSheets from './ShiftsFormSheets';
import ShiftsErrorHandler from './ShiftsErrorHandler';
import ShiftsLoadingSkeleton from './ShiftsLoadingSkeleton';

const UnifiedShiftsMainContainer: React.FC = () => {
  const containerProps = useUnifiedShiftsContainer();
  
  const {
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
    calendarSelectedDate,
    handleCalendarDateChange,
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
      <ShiftsContentRenderer 
        {...containerProps} 
        onEditShift={openEditDialog}
        onDeleteShift={deleteShift}
        onAddShift={handleOpenAddSheet}
        onAddShiftForDate={handleOpenAddSheetWithDate}
        calendarSelectedDate={calendarSelectedDate}
        handleCalendarDateChange={handleCalendarDateChange}
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
