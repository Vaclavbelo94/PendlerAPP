
import React, { useState, useCallback, useMemo } from 'react';
import UnifiedShiftCalendar from './UnifiedShiftCalendar';
import { Shift } from '@/types/shifts';

interface ShiftCalendarContainerProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift: () => void;
  onAddShiftForDate: (date: Date) => void;
  onSelectedDateChange?: (date: Date | undefined) => void;
  isLoading?: boolean;
}

const ShiftCalendarContainer: React.FC<ShiftCalendarContainerProps> = React.memo(({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  onSelectedDateChange,
  isLoading = false
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSelectDate = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    onSelectedDateChange?.(date);
  }, [onSelectedDateChange]);

  const memoizedProps = useMemo(() => ({
    shifts,
    selectedDate,
    onSelectDate: handleSelectDate,
    onEditShift,
    onDeleteShift,
    onAddShift,
    onAddShiftForDate,
    isLoading,
    className: "w-full"
  }), [shifts, selectedDate, handleSelectDate, onEditShift, onDeleteShift, onAddShift, onAddShiftForDate, isLoading]);

  return <UnifiedShiftCalendar {...memoizedProps} />;
});

ShiftCalendarContainer.displayName = 'ShiftCalendarContainer';

export default ShiftCalendarContainer;
