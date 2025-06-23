
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CalendarDays, Edit, Trash2 } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface MobileShiftCalendarGridProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

export const MobileShiftCalendarGrid: React.FC<MobileShiftCalendarGridProps> = ({
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { t, i18n } = useTranslation('shifts');

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

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Create shifts map for quick lookup
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

  // Get shifts for selected date
  const selectedShifts = useMemo(() => {
    if (!selectedDate) return [];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return isSameDay(shiftDate, selectedDate);
    });
  }, [shifts, selectedDate]);

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

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      default: return type;
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const weekDays = getWeekDays();

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" />
              {t('shiftsCalendar')}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousMonth}
                className="h-8 w-8 p-0"
                aria-label={t('previousMonth')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                className="h-8 w-8 p-0"
                aria-label={t('nextMonth')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-center">
            <span className="text-lg font-semibold">
              {format(currentDate, 'LLLL yyyy', { locale: getDateLocale() })}
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

          {/* Calendar grid - Fixed responsive layout */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const shift = getShiftForDate(day);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    // Fixed responsive sizing - using aspect-square with proper constraints
                    "relative w-full aspect-square flex flex-col items-center justify-center text-xs font-medium rounded-md transition-all duration-200 touch-manipulation",
                    // Minimum size for touch targets on very small screens
                    "min-h-[40px] min-w-[40px]",
                    // Text and interaction states
                    isCurrentMonth 
                      ? "text-foreground hover:bg-accent" 
                      : "text-muted-foreground/50",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                    isTodayDate && !isSelected && "bg-accent text-accent-foreground font-bold",
                    !isCurrentMonth && "opacity-40",
                    // Ensure proper spacing and overflow handling
                    "overflow-hidden"
                  )}
                >
                  <span className="relative z-10 leading-none text-[10px] sm:text-xs">
                    {format(day, 'd')}
                  </span>
                  
                  {/* Shift indicator - smaller for mobile */}
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
        </CardContent>
      </Card>

      {/* Selected date details */}
      {selectedDate && (
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {format(selectedDate, 'dd. MMMM yyyy', { locale: getDateLocale() })}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {selectedShifts.length === 0 
                ? t('noShiftsForThisDay')
                : `${selectedShifts.length} ${selectedShifts.length > 1 ? t('shifts') : t('shift')}`
              }
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {selectedShifts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">{t('noShiftsPlannedForThisDay')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Badge className={cn("text-xs flex-shrink-0", 
                        shift.type === 'morning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        shift.type === 'afternoon' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        shift.type === 'night' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      )}>
                        {getShiftTypeLabel(shift.type)}
                      </Badge>
                      {shift.notes && (
                        <span className="text-xs text-muted-foreground truncate">
                          {shift.notes}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditShift(shift)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shift.id && onDeleteShift(shift.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
