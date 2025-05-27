
import React, { useState } from 'react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import FastLoadingSkeleton from './FastLoadingSkeleton';
import ShiftsPageHeader from './ShiftsPageHeader';
import ShiftsPageContent from './ShiftsPageContent';
import ShiftsFormSheets from './ShiftsFormSheets';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';

const OptimizedShiftsContainer: React.FC = () => {
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

  // Show skeleton during initial load with fast timeout
  if (!isInitialized || (isLoading && shifts.length === 0)) {
    return <FastLoadingSkeleton onRetry={handleRetry} timeoutMs={8000} />;
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

  return (
    <div className="container max-w-7xl mx-auto px-4">
      {/* Network status indicator */}
      {!isOnline && (
        <Alert className="mb-4 border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Offline režim - změny budou synchronizovány při obnovení připojení
          </AlertDescription>
        </Alert>
      )}

      {isSlowConnection && isOnline && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <Wifi className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Pomalé připojení detekováno - načítání může trvat déle
          </AlertDescription>
        </Alert>
      )}

      {/* Error state with quick retry */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
          <div className="mt-2">
            <Button 
              onClick={handleRetry} 
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Zkusit znovu
            </Button>
          </div>
        </Alert>
      )}

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
