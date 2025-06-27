
import React from 'react';
import { useUnifiedShiftsContainer } from '@/hooks/shifts/useUnifiedShiftsContainer';
import FastLoadingSkeleton from './FastLoadingSkeleton';
import ShiftsPageHeader from './ShiftsPageHeader';
import ShiftsFormSheets from './ShiftsFormSheets';
import EmptyShiftsState from './EmptyShiftsState';
import ShiftsErrorHandler from './ShiftsErrorHandler';
import ShiftsContentRenderer from './ShiftsContentRenderer';
import ShiftsNavigation from './ShiftsNavigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UnifiedShiftsMainContainer: React.FC = () => {
  const { t } = useTranslation('shifts');
  const {
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
    isLoading,
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
    isDHLUser,
    hasDHLAssignment,
    userAssignment
  } = useUnifiedShiftsContainer();

  if (!isInitialized || (isLoading && shifts.length === 0)) {
    return <FastLoadingSkeleton onRetry={handleRetry} timeoutMs={8000} />;
  }

  if (!user) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('loginRequired')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (shifts.length === 0 && !isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4">
        {isDHLUser && hasDHLAssignment && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              DHL zaměstnanec: Vaše směny budou importovány administrátorem na základě vaší pozice ({userAssignment?.dhl_position?.name}) a týdnů ({userAssignment?.dhl_work_group?.name}).
            </AlertDescription>
          </Alert>
        )}
        
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

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <ShiftsErrorHandler
        isOnline={isOnline}
        isSlowConnection={isSlowConnection}
        error={error}
        onRetry={handleRetry}
      />

      {isDHLUser && hasDHLAssignment && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            DHL zaměstnanec: Pozice {userAssignment?.dhl_position?.name}, {userAssignment?.dhl_work_group?.name}. 
            Směny jsou importovány administrátorem. Můžete je upravovat podle potřeby.
          </AlertDescription>
        </Alert>
      )}

      <ShiftsPageHeader onAddShift={handleOpenAddSheet} />

      <ShiftsNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="mt-6">
        <ShiftsContentRenderer
          activeSection={activeSection}
          isChanging={isChanging}
          shifts={shifts}
          onEditShift={openEditDialog}
          onDeleteShift={deleteShift}
        />
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

export default UnifiedShiftsMainContainer;
