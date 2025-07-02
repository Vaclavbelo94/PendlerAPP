
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
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Shifts = () => {
  const { t } = useTranslation('shifts');
  const isMobile = useIsMobile();
  const {
    shifts,
    isLoading,
    isSaving,
    createShift,
    updateShift,
    deleteShift,
  } = useShiftsCRUD();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDateForNewShift, setSelectedDateForNewShift] = useState<Date | null>(null);

  const handleAddShift = () => {
    console.log('handleAddShift called - selectedDate:', selectedDate);
    setSelectedDateForNewShift(selectedDate || new Date());
    setIsAddSheetOpen(true);
  };

  const handleAddShiftForDate = (date: Date) => {
    console.log('handleAddShiftForDate called - date:', date);
    setSelectedDateForNewShift(date);
    setIsAddSheetOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    console.log('handleEditShift called - shift:', shift);
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  };

  const handleCreateShift = async (formData: ShiftFormData) => {
    if (!selectedDateForNewShift) {
      console.error('No date selected for new shift');
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
    if (!editingShift?.id) {
      console.error('No shift selected for editing');
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
    console.log('Deleting shift:', shiftId);
    await deleteShift(shiftId);
  };

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
      <FloatingAddButton onClick={handleAddShift} />

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
