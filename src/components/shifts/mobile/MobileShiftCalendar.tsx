
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { cn } from '@/lib/utils';
import { MobileCalendarGrid } from './MobileCalendarGrid';
import { MobileShiftDetails } from './MobileShiftDetails';

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Touch handling for swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - next month
      setCurrentDate(prev => addMonths(prev, 1));
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }
    }
    if (isRightSwipe) {
      // Swipe right - previous month
      setCurrentDate(prev => subMonths(prev, -1));
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }
    }
  };

  // Memoize shifts for selected date
  const selectedShifts = useMemo(() => {
    if (!selectedDate) return [];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return isSameDay(shiftDate, selectedDate);
    });
  }, [shifts, selectedDate]);

  // Memoize days with shifts for the current month
  const daysWithShifts = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= monthStart && shiftDate <= monthEnd;
    });
  }, [shifts, currentDate]);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return (
    <div className="space-y-4">
      {/* Mobile Calendar Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <CardTitle className="text-lg text-center">
              {format(currentDate, 'MMMM yyyy', { locale: cs })}
            </CardTitle>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent
          className="px-2 pb-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <MobileCalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            shifts={daysWithShifts}
            onDateSelect={handleDateSelect}
          />
        </CardContent>
      </Card>

      {/* Mobile Shift Details */}
      <MobileShiftDetails
        selectedDate={selectedDate}
        shifts={selectedShifts}
        onEditShift={onEditShift}
        onDeleteShift={onDeleteShift}
      />
    </div>
  );
});

MobileShiftCalendar.displayName = 'MobileShiftCalendar';
