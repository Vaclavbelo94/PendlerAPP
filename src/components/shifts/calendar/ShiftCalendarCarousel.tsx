
import React, { useState } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ShiftCalendarCarouselProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

const ShiftCalendarCarousel: React.FC<ShiftCalendarCarouselProps> = ({
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t, i18n } = useTranslation('shifts');

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

  const goToPreviousWeek = () => {
    setCurrentDate(prev => subDays(prev, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getShiftForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.find(shift => {
      const shiftDate = typeof shift.date === 'string' ? shift.date : format(new Date(shift.date), 'yyyy-MM-dd');
      return shiftDate === dateString;
    });
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'afternoon': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'night': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('types.morning');
      case 'afternoon': return t('types.afternoon');
      case 'night': return t('types.night');
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousWeek}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('previousMonth')}
        </Button>
        
        <h3 className="text-lg font-semibold">
          {format(weekStart, 'dd.MM', { locale: getDateLocale() })} - {format(weekEnd, 'dd.MM.yyyy', { locale: getDateLocale() })}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextWeek}
          className="flex items-center gap-2"
        >
          {t('nextMonth')}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const shift = getShiftForDate(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "p-4 border rounded-lg min-h-[120px] transition-all",
                isToday ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium">
                    {format(day, 'EEE', { locale: getDateLocale() })}
                  </div>
                  <div className={cn("text-lg font-semibold", isToday && "text-primary")}>
                    {format(day, 'd')}
                  </div>
                </div>
                {isToday && (
                  <Badge variant="secondary" className="text-xs">
                    {t('today')}
                  </Badge>
                )}
              </div>

              {shift ? (
                <div className="space-y-2">
                  <Badge className={cn("text-xs", getShiftTypeColor(shift.type))}>
                    {getShiftTypeLabel(shift.type)}
                  </Badge>
                  {shift.notes && (
                    <p className="text-xs text-muted-foreground truncate">
                      {shift.notes}
                    </p>
                  )}
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditShift(shift)}
                      className="h-6 px-2 text-xs"
                    >
                      {t('editShift')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {t('noShift')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftCalendarCarousel;
