
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ShiftFormData } from '@/types/shifts';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import UnifiedShiftForm from './forms/UnifiedShiftForm';
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
            <SheetTitle>Přidat novou směnu</SheetTitle>
            <SheetDescription>
              Vyplňte údaje o nové směně
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <UnifiedShiftForm
              onSubmit={handleAddShiftSubmit}
              onCancel={handleAddSheetClose}
              isLoading={isSaving}
              selectedDate={selectedDateForNewShift}
              submitLabel="Přidat"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Shift Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Upravit směnu</SheetTitle>
            <SheetDescription>
              Upravte údaje směny
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <UnifiedShiftForm
              onSubmit={handleEditShiftSubmit}
              onCancel={handleEditSheetClose}
              isLoading={isSaving}
              initialData={editingShift ? {
                type: editingShift.type,
                notes: editingShift.notes || ''
              } : undefined}
              selectedDate={editingShift ? new Date(editingShift.date) : undefined}
              submitLabel="Upravit směnu"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShiftsFormSheets;
