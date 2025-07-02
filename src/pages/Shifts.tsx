
import React, { useState } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/layouts/Layout';
import UnifiedShiftCalendar from '@/components/shifts/calendar/UnifiedShiftCalendar';
import FloatingAddButton from '@/components/shifts/FloatingAddButton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import ShiftForm from '@/components/shifts/forms/ShiftForm';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useTranslation } from 'react-i18next';
import { useShiftsCRUD, Shift, ShiftFormData } from '@/hooks/shifts/useShiftsCRUD';
import { Calendar, Plus, LogIn, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Shifts = () => {
  const { t } = useTranslation('shifts');
  const isMobile = useIsMobile();
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    shifts,
    isLoading,
    isSaving,
    createShift,
    updateShift,
    deleteShift,
    refreshShifts,
  } = useShiftsCRUD();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDateForNewShift, setSelectedDateForNewShift] = useState<Date | null>(null);

  console.log('Shifts page - Auth state:', { user: user?.email, isLoading: authLoading, isAuthenticated: !!user });
  console.log('Shifts page - Data state:', { shiftsCount: shifts.length, isLoading, isSaving });

  const handleAddShift = () => {
    if (!user) {
      console.log('Cannot add shift - user not authenticated');
      return;
    }
    console.log('handleAddShift called - selectedDate:', selectedDate);
    setSelectedDateForNewShift(selectedDate || new Date());
    setIsAddSheetOpen(true);
  };

  const handleAddShiftForDate = (date: Date) => {
    if (!user) {
      console.log('Cannot add shift for date - user not authenticated');
      return;
    }
    console.log('handleAddShiftForDate called - date:', date);
    setSelectedDateForNewShift(date);
    setIsAddSheetOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    if (!user) {
      console.log('Cannot edit shift - user not authenticated');
      return;
    }
    console.log('handleEditShift called - shift:', shift);
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  };

  const handleCreateShift = async (formData: ShiftFormData) => {
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
  };

  const handleUpdateShift = async (formData: ShiftFormData) => {
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
  };

  const handleDeleteShift = async (shiftId: string) => {
    if (!user) {
      console.log('Cannot delete shift - user not authenticated');
      return;
    }
    console.log('Deleting shift:', shiftId);
    await deleteShift(shiftId);
  };

  const handleRetry = () => {
    console.log('Retrying to load shifts...');
    refreshShifts();
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('loadingAuth') || 'Ověřování přihlášení...'}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show authentication required state
  if (!user) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in">
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
              <p className="text-muted-foreground mt-1">{t('shiftsDescription')}</p>
            </div>
            
            {/* Hlavní tlačítko pro přidání směny - skryté na mobilu kvůli FAB */}
            {!isMobile && (
              <Button
                onClick={handleAddShift}
                className="flex items-center gap-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                {t('addShift')}
              </Button>
            )}
          </div>
          
          {/* Error state with retry option */}
          {!isLoading && shifts.length === 0 && (
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
            <UnifiedShiftCalendar
              shifts={shifts}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onEditShift={handleEditShift}
              onDeleteShift={handleDeleteShift}
              onAddShift={handleAddShift}
              onAddShiftForDate={handleAddShiftForDate}
              isLoading={isLoading}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button pro mobilní zařízení */}
      {user && <FloatingAddButton onClick={handleAddShift} />}

      {/* Add Shift Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('addNewShift')}
            </SheetTitle>
            <SheetDescription>
              {selectedDateForNewShift && (
                <>
                  {t('addingShiftFor')} {format(selectedDateForNewShift, 'dd.MM.yyyy')}
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <ShiftForm
              onSubmit={handleCreateShift}
              onCancel={() => {
                setIsAddSheetOpen(false);
                setSelectedDateForNewShift(null);
              }}
              isLoading={isSaving}
              initialDate={selectedDateForNewShift}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Shift Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('editShift')}
            </SheetTitle>
            <SheetDescription>
              {t('editShiftDetails')}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <ShiftForm
              shift={editingShift}
              onSubmit={handleUpdateShift}
              onCancel={() => {
                setIsEditSheetOpen(false);
                setEditingShift(null);
              }}
              isLoading={isSaving}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Shifts;
