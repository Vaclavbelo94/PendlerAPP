
import React from 'react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import ShiftForm from '@/components/shifts/ShiftForm';
import { Shift } from '@/hooks/useShiftsManagement';

interface ShiftsFormSheetsProps {
  isAddSheetOpen: boolean;
  setIsAddSheetOpen: (open: boolean) => void;
  isEditSheetOpen: boolean;
  setIsEditSheetOpen: (open: boolean) => void;
  editingShift: Shift | null;
  setEditingShift: (shift: Shift | null) => void;
  onAddShift: (formData: any) => Promise<void>;
  onEditShift: (formData: any) => Promise<void>;
  isSaving: boolean;
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
  isSaving
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Add Shift Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className={cn("overflow-y-auto", isMobile ? "w-full" : "sm:max-w-2xl")}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Přidat novou směnu
            </SheetTitle>
            <SheetDescription>
              Vyplňte údaje o vaší pracovní směně. Všechna pole označená * jsou povinná.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <ShiftForm
              onSubmit={onAddShift}
              onCancel={() => setIsAddSheetOpen(false)}
              isLoading={isSaving}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Shift Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className={cn("overflow-y-auto", isMobile ? "w-full" : "sm:max-w-2xl")}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upravit směnu
            </SheetTitle>
            <SheetDescription>
              Upravte údaje o vaší pracovní směně.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <ShiftForm
              onSubmit={onEditShift}
              onCancel={() => {
                setIsEditSheetOpen(false);
                setEditingShift(null);
              }}
              isLoading={isSaving}
              shift={editingShift}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShiftsFormSheets;
