
import React, { useMemo, useCallback, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { cs, de, pl } from "date-fns/locale";
import { Shift, ShiftType } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  currentShift?: Shift;
  onOpenNoteDialog?: () => void;
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onSelectDate,
  currentShift,
  onOpenNoteDialog
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
    morning: 'bg-blue-100 text-blue-800 border-blue-200',
    afternoon: 'bg-orange-100 text-orange-800 border-orange-200',
    night: 'bg-purple-100 text-purple-800 border-purple-200'
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
      const dateKey = format(shift.date, 'yyyy-MM-dd');
      lookup.set(dateKey, shift);
    });
    
    return lookup;
  }, [shifts]);

  // Memoized days in current month for virtualization
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Optimized shift lookup function
  const getShiftForDate = useCallback((date: Date): Shift | undefined => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return shiftsByDate.get(dateKey);
  }, [shiftsByDate]);

  // Memoized modifiers for calendar styling
  const modifiers = useMemo(() => {
    const datesWithShifts = shifts.map(shift => new Date(shift.date));
    return {
      hasShift: datesWithShifts
    };
  }, [shifts]);

  const modifiersStyles = useMemo(() => ({
    hasShift: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'white',
      fontWeight: 'bold'
    }
  }), []);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    onSelectDate(today);
  }, [onSelectDate]);

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
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          locale={getDateLocale()}
          className="w-full"
        />
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="text-sm text-muted-foreground">{t('shiftTypesLegend')}:</div>
          {Object.entries(SHIFT_TYPE_COLORS).map(([type, colorClass]) => (
            <Badge 
              key={type}
              variant="secondary" 
              className={`text-xs ${colorClass}`}
            >
              {getShiftTypeLabel(type as ShiftType)}
            </Badge>
          ))}
        </div>
        
        {/* Selected date info */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="font-medium">
              {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: getDateLocale() })}
            </div>
            {currentShift ? (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={SHIFT_TYPE_COLORS[currentShift.type as ShiftType]}>
                    {getShiftTypeLabel(currentShift.type as ShiftType)}
                  </Badge>
                  {currentShift.notes && (
                    <span className="text-sm text-muted-foreground">
                      {t('notes')}: {currentShift.notes.substring(0, 50)}
                      {currentShift.notes.length > 50 ? '...' : ''}
                    </span>
                  )}
                </div>
                {onOpenNoteDialog && (
                  <button
                    onClick={onOpenNoteDialog}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('editShift')}
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">
                {t('noShiftsForThisDay')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedShiftCalendar;
