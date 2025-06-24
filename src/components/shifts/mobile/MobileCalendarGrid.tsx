
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
  const { i18n, t } = useTranslation('shifts');

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

  // Get localized week days
  const getWeekDays = () => {
    switch (i18n.language) {
      case 'de': return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
      case 'pl': return ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
      case 'cs':
      default: return ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
    }
  };

  // Calculate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get shift for a specific date
  const getShiftForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.find(shift => {
      // Handle both string dates and Date objects
      const shiftDate = typeof shift.date === 'string' ? shift.date : format(new Date(shift.date), 'yyyy-MM-dd');
      return shiftDate === dateString;
    });
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

  const weekDays = getWeekDays();

  return (
    <div className="w-full">
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="h-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
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
                "relative aspect-square w-full flex flex-col items-center justify-center text-xs font-medium rounded transition-all duration-200 touch-manipulation",
                "min-h-[40px] p-1", // Reduced height for mobile
                isCurrentMonth 
                  ? "text-foreground hover:bg-accent" 
                  : "text-muted-foreground/50",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                isTodayDate && !isSelected && "bg-accent text-accent-foreground font-bold",
                !isCurrentMonth && "opacity-40"
              )}
            >
              <span className="relative z-10 leading-none">
                {format(day, 'd')}
              </span>
              
              {/* Shift indicator */}
              {shift && (
                <div
                  className={cn(
                    "absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full",
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
