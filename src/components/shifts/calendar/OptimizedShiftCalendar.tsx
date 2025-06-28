
import React, { useMemo, useCallback, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isValid } from "date-fns";
import { cs, de, pl } from "date-fns/locale";
import { Shift, ShiftType } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
  onAddShift?: () => void;
  onAddShiftForDate?: (date: Date) => void;
  onDateChange?: (date: Date | undefined) => void;
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onSelectDate,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  onDateChange
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const SHIFT_TYPE_COLORS = {
    morning: 'bg-blue-500',
    afternoon: 'bg-amber-500',
    night: 'bg-indigo-500'
  } as const;

  const getShiftTypeLabel = (type: ShiftType) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      default: return type;
    }
  };

  // Memoized shift lookup for better performance
  const shiftsByDate = useMemo(() => {
    const lookup = new Map<string, Shift>();
    
    shifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'yyyy-MM-dd');
      lookup.set(dateKey, shift);
    });
    
    return lookup;
  }, [shifts]);

  // Get shift for specific date
  const getShiftForDate = useCallback((date: Date): Shift | undefined => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return shiftsByDate.get(dateKey);
  }, [shiftsByDate]);

  // Get current shift for selected date
  const currentShift = selectedDate ? getShiftForDate(selectedDate) : undefined;

  // Custom day component with unified styling
  const CustomDay = ({ date: dayDate, displayMonth, ...props }: any) => {
    if (!dayDate || !isValid(dayDate)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">?</span>
        </div>
      );
    }

    const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
    const isTodayDate = isToday(dayDate);
    const isCurrentMonth = dayDate.getMonth() === displayMonth.getMonth();
    const shiftForDate = getShiftForDate(dayDate);
    
    return (
      <div className="relative w-full h-full">
        <button
          {...props}
          className={cn(
            "w-full h-full p-0 font-normal relative flex items-center justify-center",
            "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
            "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Today styling
            isTodayDate && !isSelected && "font-bold ring-2 ring-orange-400 ring-offset-1 bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100",
            // Selected styling (unified for both selection and shift planning)
            isSelected && "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 ring-2 ring-blue-500 ring-offset-2 font-semibold shadow-md",
            // Current month vs other months
            !isCurrentMonth && "text-muted-foreground opacity-50",
            // Ensure selected overrides today
            isSelected && isTodayDate && "bg-blue-600 text-white ring-blue-500"
          )}
        >
          <span className="relative z-10">
            {dayDate.getDate()}
          </span>
          {/* Shift indicator dot */}
          {shiftForDate && !isSelected && (
            <div className={cn(
              "absolute top-1 right-1 w-2 h-2 rounded-full",
              SHIFT_TYPE_COLORS[shiftForDate.type]
            )} />
          )}
        </button>
      </div>
    );
  };

  const handleDateSelect = useCallback((date: Date | undefined) => {
    console.log('OptimizedShiftCalendar: Date selected:', date);
    onSelectDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  }, [onSelectDate, onDateChange]);

  const handleAddShiftClick = useCallback(() => {
    if (selectedDate && onAddShiftForDate) {
      onAddShiftForDate(selectedDate);
    } else if (onAddShift) {
      onAddShift();
    }
  }, [selectedDate, onAddShiftForDate, onAddShift]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  }, [handleDateSelect]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {t('shiftsCalendar')}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label={t('previousMonth')}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleTodayClick}
              className="px-3 py-1 text-sm hover:bg-muted rounded-md transition-colors"
            >
              {t('today')}
            </button>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label={t('nextMonth')}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: getDateLocale() })}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Legend */}
        <div className="mb-4 p-3 border rounded-lg bg-muted/30">
          <div className="flex flex-wrap gap-3 items-center justify-center text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded ring-2 ring-orange-400 bg-orange-50 dark:bg-orange-950/30"></div>
              <span className="text-muted-foreground">Dnes</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-600"></div>
              <span className="text-muted-foreground">Vybraný den</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">Ranní</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-muted-foreground">Odpolední</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-muted-foreground">Noční</span>
            </div>
          </div>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={getDateLocale()}
          components={{
            Day: CustomDay
          }}
          className="w-full mx-auto pointer-events-auto"
        />
        
        {/* Selected date info */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="font-medium mb-2">
              {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: getDateLocale() })}
            </div>
            {currentShift ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    SHIFT_TYPE_COLORS[currentShift.type]
                  )} />
                  <span className="font-medium">{getShiftTypeLabel(currentShift.type)}</span>
                  {currentShift.notes && (
                    <span className="text-sm text-muted-foreground">
                      - {currentShift.notes.substring(0, 30)}
                      {currentShift.notes.length > 30 ? '...' : ''}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditShift && onEditShift(currentShift)}
                  className="flex items-center gap-1"
                >
                  <Edit3 className="h-3 w-3" />
                  {t('edit')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('noShiftsForThisDay')}
                </span>
                <Button
                  size="sm"
                  onClick={handleAddShiftClick}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-3 w-3" />
                  {t('addShift')}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedShiftCalendar;
