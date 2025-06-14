
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/types/shifts';
import { cn } from '@/lib/utils';

interface MobileCalendarGridProps {
  currentDate: Date;
  selectedDate?: Date;
  shifts: Shift[];
  onDateSelect: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}

export const MobileCalendarGrid: React.FC<MobileCalendarGridProps> = ({
  currentDate,
  selectedDate,
  shifts,
  onDateSelect,
  onMonthChange
}) => {
  // Calculate calendar grid with proper week alignment
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Create shifts lookup map for performance
  const shiftsMap = useMemo(() => {
    const map = new Map<string, Shift>();
    shifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'yyyy-MM-dd');
      map.set(dateKey, shift);
    });
    return map;
  }, [shifts]);

  // Get shift for a specific date
  const getShiftForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return shiftsMap.get(dateKey);
  };

  // Get shift type indicator color
  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-blue-500';
      case 'afternoon':
        return 'bg-amber-500';
      case 'night':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    onMonthChange?.(newDate);
  };

  // Week days header
  const weekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" />
            Kalendář směn
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="h-8 w-8 p-0"
              aria-label="Předchozí měsíc"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
              aria-label="Následující měsíc"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-center">
          <span className="text-lg font-semibold">
            {format(currentDate, 'LLLL yyyy', { locale: cs })}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-0">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid - Improved responsive layout */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            const shift = getShiftForDate(day);

            return (
              <button
                key={index}
                onClick={() => onDateSelect(day)}
                className={cn(
                  // Fixed responsive sizing with proper constraints
                  "relative w-full flex flex-col items-center justify-center text-xs font-medium rounded-md transition-all duration-200 touch-manipulation",
                  // Responsive height using clamp for better scaling
                  "h-10 sm:h-12 min-h-[2.5rem]",
                  // Text and interaction states
                  isCurrentMonth 
                    ? "text-foreground hover:bg-accent" 
                    : "text-muted-foreground/50",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  isTodayDate && !isSelected && "bg-accent text-accent-foreground font-bold",
                  !isCurrentMonth && "opacity-40",
                  // Ensure proper overflow handling
                  "overflow-hidden"
                )}
              >
                <span className="relative z-10 leading-none">
                  {format(day, 'd')}
                </span>
                
                {/* Shift indicator - responsive sizing */}
                {shift && (
                  <div
                    className={cn(
                      "absolute bottom-1 left-1/2 transform -translate-x-1/2 rounded-full",
                      "w-1.5 h-1.5 sm:w-2 sm:h-2",
                      getShiftTypeColor(shift.type),
                      isSelected && "bg-primary-foreground"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
