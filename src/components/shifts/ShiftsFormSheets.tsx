
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ShiftFormData, ShiftType } from '@/types/shifts';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import ShiftForm from './forms/ShiftForm';
import { useTranslation } from 'react-i18next';

interface ShiftsFormSheetsProps {
  isAddSheetOpen: boolean;
  setIsAddSheetOpen: (open: boolean) => void;
  isEditSheetOpen: boolean;
  setIsEditSheetOpen: (open: boolean) => void;
  editingShift: Shift | null;
  setEditingShift: (shift: Shift | null) => void;
  onAddShift: (data: ShiftFormData) => Promise<void>;
  onEditShift: (data: ShiftFormData) => Promise<void>;
  isSaving: boolean;
  selectedDateForNewShift?: Date;
}

const ShiftsFormSheets: React.FC<ShiftsFormSheetsProps> = ({
  isAddSheetOpen,
  setIsAddSheetOpen,
  isEditSheetOpen,
  setIsEditSheetOpen,
  editingShift,
  setEditingShift,
  onAddShift,
  onEditShift,
  isSaving,
  selectedDateForNewShift
}) => {
  const { t } = useTranslation('shifts');

  const handleAddShiftSubmit = async (data: ShiftFormData) => {
    await onAddShift(data);
  };

  const handleEditShiftSubmit = async (data: ShiftFormData) => {
    await onEditShift(data);
  };

  const handleAddSheetClose = () => {
    setIsAddSheetOpen(false);
  };

  const handleEditSheetClose = () => {
    setIsEditSheetOpen(false);
    setEditingShift(null);
  };

  return (
    <>
      {/* Add Shift Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('addNewShift')}</SheetTitle>
            <SheetDescription>
              {t('fillShiftDetails')}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ShiftForm
              onSubmit={handleAddShiftSubmit}
              onCancel={handleAddSheetClose}
              isLoading={isSaving}
              selectedDate={selectedDateForNewShift}
              submitLabel={t('add')}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Shift Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('editShift')}</SheetTitle>
            <SheetDescription>
              {t('editShiftDetails')}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ShiftForm
              onSubmit={handleEditShiftSubmit}
              onCancel={handleEditSheetClose}
              isLoading={isSaving}
              initialData={editingShift ? {
                type: editingShift.type as ShiftType,
                notes: editingShift.notes || ''
              } : undefined}
              selectedDate={editingShift ? new Date(editingShift.date) : undefined}
              submitLabel={t('updateShift')}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShiftsFormSheets;
