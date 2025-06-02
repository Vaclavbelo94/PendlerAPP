
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { MobileShiftDetails } from './MobileShiftDetails';
import OptimizedShiftCalendar from '../OptimizedShiftCalendar';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Memoize shifts for selected date
  const selectedShifts = useMemo(() => {
    if (!selectedDate) return [];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return isSameDay(shiftDate, selectedDate);
    });
  }, [shifts, selectedDate]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  return (
    <div className="space-y-3">
      {/* Standard Optimized Calendar - responsive for mobile */}
      <div className="w-full">
        <OptimizedShiftCalendar
          shifts={shifts}
          onEditShift={onEditShift}
          onDeleteShift={onDeleteShift}
        />
      </div>

      {/* Mobile Shift Details - only show if date selected and has shifts */}
      {selectedDate && selectedShifts.length > 0 && (
        <MobileShiftDetails
          selectedDate={selectedDate}
          shifts={selectedShifts}
          onEditShift={onEditShift}
          onDeleteShift={onDeleteShift}
        />
      )}
    </div>
  );
});

MobileShiftCalendar.displayName = 'MobileShiftCalendar';
