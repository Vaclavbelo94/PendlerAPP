
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import UnifiedShiftCalendar from './calendar/UnifiedShiftCalendar';
import ShiftsFormSheets from './ShiftsFormSheets';
import { Shift } from '@/types/shifts'; // Using the updated consistent type
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
  const shiftsManagement = useOptimizedShiftsManagement(user?.id);
  
  // Use external data if provided, otherwise use internal management
  const shifts = externalShifts || shiftsManagement.shifts;
  const onEditShift = externalOnEditShift || ((shift: Shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  });
  const onDeleteShift = externalOnDeleteShift || ((shiftId: string) => shiftsManagement.deleteShift(shiftId));
  const isLoading = !externalShifts ? shiftsManagement.isLoading : false;

  const handleAddShiftClick = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setIsAddSheetOpen(true);
  };

  const handleAddShift = async (formData: any) => {
    try {
      // Ensure user_id is provided since it's required
      const shiftData = {
        ...formData,
        user_id: user?.id || '', // Provide user_id as required
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
      };
      await shiftsManagement.addShift(shiftData);
      setIsAddSheetOpen(false);
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  };

  const handleEditShift = async (formData: any) => {
    if (!editingShift) return;
    
    try {
      await shiftsManagement.updateShift({
        ...editingShift,
        ...formData
      });
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
        isSaving={shiftsManagement.isSaving}
      />
    </>
  );
};

export default ShiftsCalendar;
