
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { cn } from '@/lib/utils';

interface MobileCalendarGridProps {
  currentDate: Date;
  selectedDate?: Date;
  shifts: Shift[];
  onDateSelect: (date: Date) => void;
}

export const MobileCalendarGrid: React.FC<MobileCalendarGridProps> = ({
  currentDate,
  selectedDate,
  shifts,
  onDateSelect
}) => {
  // Calculate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get shift for a specific date
  const getShiftForDate = (date: Date) => {
    return shifts.find(shift => isSameDay(new Date(shift.date), date));
  };

  // Get shift type color
  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-orange-500';
      case 'afternoon':
        return 'bg-blue-500';
      case 'night':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Week days header
  const weekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  return (
    <div className="w-full">
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

      {/* Calendar grid */}
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
                "relative h-12 w-full flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation",
                "min-h-[48px]", // Ensure minimum touch target size
                isCurrentMonth 
                  ? "text-foreground hover:bg-accent" 
                  : "text-muted-foreground/50",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                isTodayDate && !isSelected && "bg-accent text-accent-foreground font-bold",
                !isCurrentMonth && "opacity-40"
              )}
            >
              <span className="relative z-10">
                {format(day, 'd')}
              </span>
              
              {/* Shift indicator */}
              {shift && (
                <div
                  className={cn(
                    "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full",
                    getShiftTypeColor(shift.type),
                    isSelected && "bg-primary-foreground"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
