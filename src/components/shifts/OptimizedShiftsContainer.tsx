
import React, { useState, useCallback } from 'react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { useDebouncedNavigation } from '@/hooks/useDebouncedNavigation';
import FastLoadingSkeleton from './FastLoadingSkeleton';
import ShiftsPageHeader from './ShiftsPageHeader';
import ShiftsFormSheets from './ShiftsFormSheets';
import OptimizedShiftCalendar from './OptimizedShiftCalendar';
import OptimizedShiftsAnalytics from './OptimizedShiftsAnalytics';
import ShiftsReports from './ShiftsReports';
import ShiftsSettings from './ShiftsSettings';
import EmptyShiftsState from './EmptyShiftsState';
import { ShiftsNavigation } from './ShiftsNavigation';
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

  // Show skeleton during initial load
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

  // Show empty state for new users
  if (shifts.length === 0 && !isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4">
        <EmptyShiftsState onAddShift={handleOpenAddSheet} />
        <ShiftsFormSheets
          isAddSheetOpen={isAddSheetOpen}
          setIsAddSheetOpen={setIsAddSheetOpen}
          isEditSheetOpen={false}
          setIsEditSheetOpen={() => {}}
          editingShift={null}
          setEditingShift={() => {}}
          onAddShift={handleAddShift}
          onEditShift={handleEditShift}
          isSaving={isSaving}
        />
      </div>
    );
  }

  const renderContent = () => {
    if (isChanging) {
      return (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    switch (activeSection) {
      case 'calendar':
        return (
          <OptimizedShiftCalendar
            shifts={shifts}
            onEditShift={openEditDialog}
            onDeleteShift={deleteShift}
          />
        );
      case 'analytics':
        return <OptimizedShiftsAnalytics shifts={shifts} />;
      case 'reports':
        return <ShiftsReports shifts={shifts} />;
      case 'settings':
        return <ShiftsSettings />;
      default:
        return (
          <OptimizedShiftCalendar
            shifts={shifts}
            onEditShift={openEditDialog}
            onDeleteShift={deleteShift}
          />
        );
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      {/* Network status indicators */}
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

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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

      <ShiftsPageHeader onAddShift={handleOpenAddSheet} />

      {/* Category Navigation - same style as Vehicles section */}
      <ShiftsNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Content */}
      <div className="mt-6">
        {renderContent()}
      </div>

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
