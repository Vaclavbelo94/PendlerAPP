
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import ResponsivePage from '@/components/layouts/ResponsivePage';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';
import { useShiftsManagement } from '@/hooks/useShiftsManagement';
import ShiftsPageHeader from '@/components/shifts/ShiftsPageHeader';
import ShiftsPageContent from '@/components/shifts/ShiftsPageContent';
import ShiftsFormSheets from '@/components/shifts/ShiftsFormSheets';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

const Shifts = () => {
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
  } = useShiftsManagement(user?.id);

  const handleAddShift = async (formData) => {
    console.log('Adding shift with data:', formData);
    const newShift = await addShift(formData);
    if (newShift !== null) {
      setIsAddSheetOpen(false);
    }
  };

  const handleEditShift = async (formData) => {
    if (!editingShift) return;
    
    console.log('Editing shift with data:', formData);
    const updatedShift = await updateShift({ ...formData, id: editingShift.id });
    if (updatedShift !== null) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  };

  const openEditDialog = (shift) => {
    console.log('Opening edit dialog for shift:', shift);
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  };

  const handleRetry = async () => {
    console.log('Retrying shifts operation...');
    await refreshShifts();
  };

  if (!isInitialized) {
    return (
      <OptimizedPremiumCheck featureKey="shifts">
        <ResponsivePage>
          <FastLoadingFallback message="Inicializace..." />
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  if (!user) {
    return (
      <OptimizedPremiumCheck featureKey="shifts">
        <ResponsivePage>
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Pro správu směn se musíte přihlásit.
              </AlertDescription>
            </Alert>
          </div>
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  if (isLoading) {
    return (
      <OptimizedPremiumCheck featureKey="shifts">
        <ResponsivePage>
          <FastLoadingFallback message="Načítání směn..." />
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  if (error) {
    return (
      <OptimizedPremiumCheck featureKey="shifts">
        <ResponsivePage>
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
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  return (
    <OptimizedPremiumCheck featureKey="shifts">
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
      </ResponsivePage>
    </OptimizedPremiumCheck>
  );
};

export default Shifts;
