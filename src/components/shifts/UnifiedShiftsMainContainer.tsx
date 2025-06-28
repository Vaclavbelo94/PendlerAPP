
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
    handleShiftSubmit, // Use the universal handler
    isSaving
  } = containerProps;

  if (isLoading) {
    return <ShiftsLoadingSkeleton />;
  }

  if (error) {
    return <ShiftsErrorHandler error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <ShiftsContentRenderer {...containerProps} />
      
      <ShiftsFormSheets
        isAddSheetOpen={isAddSheetOpen}
        setIsAddSheetOpen={setIsAddSheetOpen}
        isEditSheetOpen={isEditSheetOpen}
        setIsEditSheetOpen={setIsEditSheetOpen}
        editingShift={editingShift}
        onSubmit={handleShiftSubmit} // Use universal handler
        isLoading={isSaving}
      />
    </div>
  );
};

export default UnifiedShiftsMainContainer;
