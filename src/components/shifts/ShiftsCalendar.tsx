
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import UnifiedShiftCalendar from './calendar/UnifiedShiftCalendar';
import { Shift } from '@/types/shifts';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Use internal shift management if no external shifts provided
  const shiftsManagement = useOptimizedShiftsManagement(user?.id);
  
  // Use external data if provided, otherwise use internal management
  const shifts = externalShifts || shiftsManagement.shifts;
  const onEditShift = externalOnEditShift || (() => {});
  const onDeleteShift = externalOnDeleteShift || ((shiftId: string) => shiftsManagement.deleteShift(shiftId));
  const isLoading = !externalShifts ? shiftsManagement.isLoading : false;

  return (
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
        isLoading={isLoading}
        className="w-full"
      />
    </motion.div>
  );
};

export default ShiftsCalendar;
