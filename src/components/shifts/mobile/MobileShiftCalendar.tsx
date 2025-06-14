
import React from 'react';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { MobileShiftCalendarGrid } from './MobileShiftCalendarGrid';
import './MobileCalendarStyles.css';

interface MobileShiftCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

export const MobileShiftCalendar: React.FC<MobileShiftCalendarProps> = React.memo(({
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  return (
    <div className="mobile-calendar">
      <MobileShiftCalendarGrid
        shifts={shifts}
        onEditShift={onEditShift}
        onDeleteShift={onDeleteShift}
      />
    </div>
  );
});

MobileShiftCalendar.displayName = 'MobileShiftCalendar';
