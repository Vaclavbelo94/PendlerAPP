
import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@/components/layouts/Layout';
import SwipeableShiftTabs from '@/components/shifts/SwipeableShiftTabs';
import FloatingAddButton from '@/components/shifts/FloatingAddButton';
import ShiftsFormSheets from '@/components/shifts/ShiftsFormSheets';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useTranslation } from 'react-i18next';
import { useShiftsCRUD, Shift, ShiftFormData } from '@/hooks/shifts/useShiftsCRUD';
import { Plus, LogIn, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardBackground from '@/components/common/DashboardBackground';

const Shifts = React.memo(() => {
  const { t } = useTranslation('shifts');
  const isMobile = useIsMobile();
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    shifts,
    isLoading: shiftsLoading,
    isSaving,
    createShift,
    updateShift,
    deleteShift,
    refreshShifts,
  } = useShiftsCRUD();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDateForNewShift, setSelectedDateForNewShift] = useState<Date | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);

  // Memoize loading state calculation
  const isLoading = useMemo(() => {
    return authLoading || (user && shiftsLoading);
  }, [authLoading, user, shiftsLoading]);

  // Debug logging for loading states
  React.useEffect(() => {
    console.log('Shifts Page - Loading states:', {
      authLoading,
      shiftsLoading,
      hasUser: !!user,
      shiftsCount: shifts.length,
      isLoading
    });
  }, [authLoading, shiftsLoading, user, shifts.length, isLoading]);

  const handleAddShift = useCallback((date?: Date) => {
    if (!user) {
      console.log('Cannot add shift - user not authenticated');
      return;
    }
    console.log('handleAddShift called - opening add sheet, date:', date);
    const targetDate = date || selectedCalendarDate || new Date();
    setSelectedDateForNewShift(targetDate);
    setIsAddSheetOpen(true);
  }, [user, selectedCalendarDate]);

  const handleAddShiftForDate = useCallback((date: Date) => {
    if (!user) {
      console.log('Cannot add shift for date - user not authenticated');
      return;
    }
    console.log('handleAddShiftForDate called - date:', date, 'opening add sheet');
    setSelectedDateForNewShift(date);
    setIsAddSheetOpen(true);
  }, [user]);

  const handleEditShift = useCallback((shift: Shift) => {
    if (!user) {
      console.log('Cannot edit shift - user not authenticated');
      return;
    }
    console.log('handleEditShift called - shift:', shift, 'opening edit sheet');
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  }, [user]);

  const handleCreateShift = useCallback(async (formData: ShiftFormData) => {
    if (!selectedDateForNewShift || !user) {
      console.error('Cannot create shift - missing data or user');
      return;
    }
    
    console.log('Creating shift for date:', selectedDateForNewShift, 'with data:', formData);
    const success = await createShift(selectedDateForNewShift, formData);
    if (success) {
      setIsAddSheetOpen(false);
      setSelectedDateForNewShift(null);
    }
  }, [selectedDateForNewShift, user, createShift]);

  const handleUpdateShift = useCallback(async (formData: ShiftFormData) => {
    if (!editingShift?.id || !user) {
      console.error('Cannot update shift - missing data or user');
      return;
    }
    
    console.log('Updating shift:', editingShift.id, 'with data:', formData);
    const success = await updateShift(editingShift.id, formData);
    if (success) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  }, [editingShift, user, updateShift]);

  const handleDeleteShift = useCallback(async (shiftId: string) => {
    if (!user) {
      console.log('Cannot delete shift - user not authenticated');
      return;
    }
    console.log('Deleting shift:', shiftId);
    await deleteShift(shiftId);
  }, [user, deleteShift]);

  const handleSelectedDateChange = useCallback((date: Date | undefined) => {
    console.log('Selected date changed:', date);
    setSelectedCalendarDate(date);
  }, []);

  const handleRetry = useCallback(() => {
    console.log('Retrying to load shifts...');
    refreshShifts();
  }, [refreshShifts]);

  // Show loading while auth is being determined or data is loading
  if (isLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <DashboardBackground variant="shifts">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
              <p className="text-muted-foreground mt-1">{t('shiftsDescription')}</p>
            </div>
            
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {authLoading ? (t('loadingAuth') || 'Ověřování přihlášení...') : 'Načítání směn...'}
                </p>
              </div>
            </div>
          </div>
        </DashboardBackground>
      </Layout>
    );
  }

  // Show authentication required state
  if (!user) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <DashboardBackground variant="shifts">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
              <p className="text-muted-foreground mt-1">{t('shiftsDescription')}</p>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  {t('authRequired') || 'Přihlášení požadováno'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('authRequiredMessage') || 'Pro zobrazení a správu směn se musíte přihlásit.'}
                </p>
                <Button onClick={() => window.location.href = '/login'} className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('signIn') || 'Přihlásit se'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </DashboardBackground>
      </Layout>
    );
  }

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <DashboardBackground variant="shifts">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
              <p className="text-muted-foreground mt-1">{t('shiftsDescription')}</p>
            </div>
            
            {!isMobile && (
              <Button
                onClick={() => handleAddShift()}
                className="flex items-center gap-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                {t('addShift')}
              </Button>
            )}
          </div>
          
          {!shiftsLoading && shifts.length === 0 && (
            <Alert className="mb-4">
              <RefreshCw className="h-4 w-4" />
              <AlertTitle>{t('noShiftsFound') || 'Žádné směny nenalezeny'}</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{t('noShiftsMessage') || 'Zatím nemáte žádné směny. Začněte přidáním první směny.'}</span>
                <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('retry') || 'Obnovit'}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="animate-fade-in">
            <SwipeableShiftTabs
              shifts={shifts}
              onEditShift={handleEditShift}
              onDeleteShift={handleDeleteShift}
              onAddShift={() => handleAddShift()}
              onAddShiftForDate={handleAddShiftForDate}
              onSelectedDateChange={handleSelectedDateChange}
              onRefreshShifts={refreshShifts}
              isLoading={shiftsLoading}
            />
          </div>
        </div>
      </DashboardBackground>

      {user && <FloatingAddButton onClick={handleAddShift} selectedDate={selectedCalendarDate} />}

      {/* Use ShiftsFormSheets component with error boundary protection */}
      <ShiftsFormSheets
        isAddSheetOpen={isAddSheetOpen}
        setIsAddSheetOpen={setIsAddSheetOpen}
        isEditSheetOpen={isEditSheetOpen}
        setIsEditSheetOpen={setIsEditSheetOpen}
        editingShift={editingShift}
        setEditingShift={setEditingShift}
        onAddShift={handleCreateShift}
        onEditShift={handleUpdateShift}
        isSaving={isSaving}
        selectedDateForNewShift={selectedDateForNewShift}
      />
    </Layout>
  );
});

Shifts.displayName = 'Shifts';

export default Shifts;
