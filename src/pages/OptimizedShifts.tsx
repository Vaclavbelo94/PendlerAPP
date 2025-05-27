
import React from 'react';
import { Helmet } from 'react-helmet';
import ResponsivePage from '@/components/layouts/ResponsivePage';
import { useUnifiedShiftsState } from '@/hooks/shifts/useUnifiedShiftsState';
import ShiftsSkeleton from '@/components/shifts/ShiftsSkeleton';
import OptimizedPremiumGate from '@/components/premium/OptimizedPremiumGate';
import ShiftsPageHeader from '@/components/shifts/ShiftsPageHeader';
import ShiftsPageContent from '@/components/shifts/ShiftsPageContent';
import ShiftsFormSheets from '@/components/shifts/ShiftsFormSheets';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

const OptimizedShifts = () => {
  const {
    isLoading,
    isReady,
    showSkeleton,
    error,
    user,
    isPremium,
    shifts,
    shiftsOperations
  } = useUnifiedShiftsState();

  const [activeSection, setActiveSection] = React.useState('calendar');
  const [isAddSheetOpen, setIsAddSheetOpen] = React.useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);
  const [editingShift, setEditingShift] = React.useState(null);

  // Show skeleton while loading or not ready
  if (isLoading || !isReady || showSkeleton) {
    return (
      <ResponsivePage enableMobileSafeArea>
        <Helmet>
          <title>Směny | Pendlerův Pomocník</title>
        </Helmet>
        <ShiftsSkeleton />
      </ResponsivePage>
    );
  }

  // Show premium gate if user is not premium
  if (user && !isPremium) {
    return (
      <ResponsivePage enableMobileSafeArea>
        <Helmet>
          <title>Směny | Pendlerův Pomocník</title>
        </Helmet>
        <OptimizedPremiumGate />
      </ResponsivePage>
    );
  }

  // Show auth required if no user
  if (!user) {
    return (
      <ResponsivePage enableMobileSafeArea>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Helmet>
            <title>Směny | Pendlerův Pomocník</title>
          </Helmet>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Pro správu směn se musíte přihlásit.
            </AlertDescription>
          </Alert>
        </div>
      </ResponsivePage>
    );
  }

  // Show error state
  if (error) {
    return (
      <ResponsivePage enableMobileSafeArea>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Helmet>
            <title>Směny | Pendlerův Pomocník</title>
          </Helmet>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={shiftsOperations.refreshShifts} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Zkusit znovu
            </Button>
          </div>
        </div>
      </ResponsivePage>
    );
  }

  const handleAddShift = async (formData) => {
    const newShift = await shiftsOperations.addShift(formData);
    if (newShift !== null) {
      setIsAddSheetOpen(false);
    }
  };

  const handleEditShift = async (formData) => {
    if (!editingShift) return;
    
    const updatedShift = await shiftsOperations.updateShift({ ...formData, id: editingShift.id });
    if (updatedShift !== null) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  };

  const openEditDialog = (shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  };

  return (
    <ResponsivePage enableMobileSafeArea>
      <div className="container max-w-7xl mx-auto px-4">
        <Helmet>
          <title>Směny | Pendlerův Pomocník</title>
        </Helmet>
        
        <ShiftsPageHeader onAddShift={() => setIsAddSheetOpen(true)} />

        <ShiftsPageContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          shifts={shifts}
          onEditShift={openEditDialog}
          onDeleteShift={shiftsOperations.deleteShift}
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
          isSaving={shiftsOperations.isSaving}
        />
      </div>
    </ResponsivePage>
  );
};

export default OptimizedShifts;
