import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cs, pl, de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Shift } from '@/types/shifts';

interface MobileCalendarViewProps {
  currentDate: Date;
  selectedDate?: Date;
  shifts: Shift[];
  onDateSelect: (date: Date) => void;
}

const MobileCalendarView: React.FC<MobileCalendarViewProps> = ({
  currentDate,
  selectedDate,
  shifts,
  onDateSelect
}) => {
  const { i18n, t } = useTranslation('shifts');
  
  const getLocale = () => {
    switch (i18n.language) {
      case 'cs': return cs;
      case 'pl': return pl;
      case 'de': return de;
      default: return cs;
    }
  };

  const getDayAbbreviations = () => {
    switch (i18n.language) {
      case 'cs': return ['NE', 'PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO'];
      case 'pl': return ['ND', 'PN', 'WT', 'ŚR', 'CZ', 'PT', 'SB'];
      case 'de': return ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'];
      default: return ['NE', 'PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO'];
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getShiftForDate = (date: Date) => {
    return shifts.find(shift => {
      const shiftDate = new Date(shift.date + 'T00:00:00');
      return isSameDay(shiftDate, date);
    });
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední'; 
      case 'night': return 'Noční';
      case 'custom': return 'Vlastní';
      default: return type;
    }
  };

  const getShiftTypeColor = (shiftType: string) => {
    switch (shiftType) {
      case 'morning': return 'bg-blue-500';
      case 'afternoon': return 'bg-orange-500';
      case 'night': return 'bg-purple-500';
      case 'custom': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const dayAbbreviations = getDayAbbreviations();

  return (
    <div className="p-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayAbbreviations.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const shift = getShiftForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center p-1 rounded-md text-sm transition-colors relative",
                isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                isDayToday && "bg-primary text-primary-foreground font-semibold",
                isSelected && !isDayToday && "bg-accent text-accent-foreground",
                !isDayToday && !isSelected && "hover:bg-accent/50"
              )}
            >
              <div className="flex items-center justify-between w-full px-1">
                <span className="text-xs font-medium">
                  {format(day, 'd')}
                </span>
                {shift && (
                  <span className="text-xs text-right leading-none">
                    {getShiftTypeLabel(shift.type)}
                  </span>
                )}
              </div>
              
              {/* Shift indicator dot */}
              {shift && (
                <div className={cn(
                  "w-1 h-1 rounded-full mt-0.5",
                  getShiftTypeColor(shift.type)
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Empty state for selected date */}
      {selectedDate && !getShiftForDate(selectedDate) && (
        <div className="mt-4 text-center text-muted-foreground text-sm">
          {t('mobile.noEventsToday', 'Žádné události pro dnešní den')}
        </div>
      )}
    </div>
  );
};

export default MobileCalendarView;