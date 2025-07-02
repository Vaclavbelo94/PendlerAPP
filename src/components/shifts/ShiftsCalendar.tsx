
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useShiftsCRUD } from '@/hooks/shifts/useShiftsCRUD';
import UnifiedShiftCalendar from './calendar/UnifiedShiftCalendar';
import ShiftsFormSheets from './ShiftsFormSheets';
import { Shift } from '@/types/shifts';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface ShiftsCalendarProps {
  shifts?: Shift[];
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
}

const ShiftsCalendar: React.FC<ShiftsCalendarProps> = ({ 
  shifts: externalShifts,
  onEditShift: externalOnEditShift,
  onDeleteShift: externalOnDeleteShift
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  
  const { user } = useAuth();
  const { t } = useTranslation('shifts');
  
  // Use internal shift management if no external shifts provided
  const {
    shifts: internalShifts,
    isLoading: internalIsLoading,
    isSaving,
    createShift,
    updateShift,
    deleteShift
  } = useShiftsCRUD();
  
  // Use external data if provided, otherwise use internal management
  const shifts = externalShifts || internalShifts;
  const onEditShift = externalOnEditShift || ((shift: Shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  });
  const onDeleteShift = externalOnDeleteShift || ((shiftId: string) => deleteShift(shiftId));
  const isLoading = !externalShifts ? internalIsLoading : false;

  const handleAddShiftClick = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setIsAddSheetOpen(true);
  };

  const handleAddShift = async (formData: any) => {
    try {
      if (selectedDate) {
        await createShift(selectedDate, formData);
        setIsAddSheetOpen(false);
      }
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  };

  const handleEditShift = async (formData: any) => {
    if (!editingShift?.id) return;
    
    try {
      await updateShift(editingShift.id, formData);
      setIsEditSheetOpen(false);
      setEditingShift(null);
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <UnifiedShiftCalendar
          shifts={shifts}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onEditShift={onEditShift}
          onDeleteShift={onDeleteShift}
          onAddShift={handleAddShiftClick}
          onAddShiftForDate={handleAddShiftClick}
          isLoading={isLoading}
          className="w-full"
        />
      </motion.div>

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
        selectedDateForNewShift={selectedDate}
      />
    </>
  );
};

export default ShiftsCalendar;
