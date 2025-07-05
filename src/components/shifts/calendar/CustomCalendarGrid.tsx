
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shift } from '@/types/shifts';
import { useTranslation } from 'react-i18next';

interface CustomCalendarGridProps {
  selectedDate?: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  shifts: Shift[];
  onAddShift: (date: Date) => void;
}

const CustomCalendarGrid: React.FC<CustomCalendarGridProps> = ({
  selectedDate,
  currentMonth,
  onDateSelect,
  onMonthChange,
  shifts,
  onAddShift
}) => {
  const { i18n } = useTranslation();
  
  // Get locale for date-fns based on current language
  const getLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      default: return cs;
    }
  };

  // Get weekday labels based on current language
  const getWeekDays = () => {
    switch (i18n.language) {
      case 'de': return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
      case 'pl': return ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
      default: return ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = getWeekDays();

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return isSameDay(shiftDate, date);
    });
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    onMonthChange(nextMonth);
  };

  return (
    <div className="w-full bg-background border rounded-lg p-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: getLocale() })}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const dayShifts = getShiftsForDate(day);
          const hasShift = dayShifts.length > 0;

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "relative h-12 sm:h-14 p-1 text-sm border-0 rounded-md transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                !isCurrentMonth && "text-muted-foreground opacity-40",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                isTodayDate && !isSelected && "ring-2 ring-orange-400 bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100 font-bold",
                hasShift && !isSelected && "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100 font-medium"
              )}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-base sm:text-lg">
                  {format(day, 'd')}
                </span>
                {hasShift && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendarGrid;
