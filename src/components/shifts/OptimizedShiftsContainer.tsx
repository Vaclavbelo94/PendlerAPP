
import React, { useState } from 'react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import ShiftsLoadingSkeleton from './ShiftsLoadingSkeleton';
import ShiftsPageHeader from './ShiftsPageHeader';
import ShiftsPageContent from './ShiftsPageContent';
import ShiftsFormSheets from './ShiftsFormSheets';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

const OptimizedShiftsContainer: React.FC = () => {
  const { user, isInitialized } = useSimplifiedAuth();
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

  const handleAddShift = async (formData) => {
    const newShift = await addShift(formData);
    if (newShift !== null) {
      setIsAddSheetOpen(false);
    }
  };

  const handleEditShift = async (formData) => {
    if (!editingShift) return;
    
    const updatedShift = await updateShift({ ...formData, id: editingShift.id });
    if (updatedShift !== null) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  };

  const openEditDialog = (shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  };

  const handleRetry = async () => {
    await refreshShifts();
  };

  // Show skeleton during initial load
  if (!isInitialized || (isLoading && shifts.length === 0)) {
    return <ShiftsLoadingSkeleton />;
  }

  // Show auth required message
  if (!user) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pro správu směn se musíte přihlásit.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Zkusit znovu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <ShiftsPageHeader onAddShift={() => setIsAddSheetOpen(true)} />

      <ShiftsPageContent
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        shifts={shifts}
        onEditShift={openEditDialog}
        onDeleteShift={deleteShift}
        onAddShift={() => setIsAddSheetOpen(true)}
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
      />
    </div>
  );
};

export default OptimizedShiftsContainer;
