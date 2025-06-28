
import React, { useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2, Plus } from 'lucide-react';
import { format, isSameDay, isToday, isValid } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileShiftCalendarGrid } from './mobile/MobileShiftCalendarGrid';
import ShiftCalendarCarousel from './calendar/ShiftCalendarCarousel';
import { StandardCard } from '@/components/ui/StandardCard';
import { useTranslation } from 'react-i18next';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift?: () => void;
  onAddShiftForDate?: (date: Date) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  selectedDate,
  onDateChange
}) => {
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation('shifts');

  // Get appropriate date-fns locale
  const getDateLocale = useCallback(() => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  }, [i18n.language]);

  const shiftsMap = useMemo(() => {
    const map = new Map<string, Shift[]>();
    shifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(shift);
    });
    return map;
  }, [shifts]);

  const selectedDateShifts = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return shiftsMap.get(dateKey) || [];
  }, [selectedDate, shiftsMap]);

  const getShiftTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      default: return type;
    }
  }, [t]);

  const getShiftTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'afternoon': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'night': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  }, []);

  // Updated modifiers - removed hasShift to avoid conflicts
  const modifiers = useMemo(() => ({
    today: (date: Date) => isToday(date),
    hasShift: (date: Date) => {
      if (!isValid(date)) return false;
      const dateKey = format(date, 'yyyy-MM-dd');
      return shiftsMap.has(dateKey);
    }
  }), [shiftsMap]);

  // Updated modifier classNames - removed background colors that conflict with selected state
  const modifiersClassNames = useMemo(() => ({
    today: 'font-bold border-2 border-primary/50',
    hasShift: 'relative'
  }), []);

  // Custom components for the calendar
  const components = useMemo(() => ({
    Day: ({ date, displayMonth, ...props }: any) => {
      // Validate date before using it
      if (!date || !isValid(date)) {
        console.warn('Invalid date received in Day component:', date);
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">?</span>
          </div>
        );
      }

      const dateKey = format(date, 'yyyy-MM-dd');
      const hasShift = shiftsMap.has(dateKey);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isTodayDate = isToday(date);
      
      return (
        <div className="relative w-full h-full">
          <button
            {...props}
            className={cn(
              "w-full h-full p-0 font-normal relative flex items-center justify-center",
              "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
              "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              isTodayDate && !isSelected && "font-bold border-2 border-primary/30",
              date.getMonth() !== displayMonth.getMonth() && "text-muted-foreground opacity-50"
            )}
          >
            <span className="relative z-10">
              {date.getDate()}
            </span>
            {hasShift && !isSelected && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
            )}
            {hasShift && isSelected && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary-foreground rounded-full" />
            )}
          </button>
        </div>
      );
    }
  }), [shiftsMap, selectedDate]);

  // Handle date selection - clear logging and ensure clean selection
  const handleDateSelect = useCallback((date: Date | undefined) => {
    console.log('Calendar date selected:', date);
    console.log('Previous selected date was:', selectedDate);
    
    // Always call the external handler to update parent state
    if (onDateChange) {
      onDateChange(date);
    }
  }, [onDateChange, selectedDate]);

  // Handle add shift click
  const handleAddShiftClick = useCallback(() => {
    console.log('Add shift clicked with selected date:', selectedDate);
    if (onAddShiftForDate && selectedDate) {
      onAddShiftForDate(selectedDate);
    } else if (onAddShift) {
      onAddShift();
    }
  }, [onAddShiftForDate, onAddShift, selectedDate]);

  // Handle add shift for selected date
  const handleAddShiftForSelectedDate = useCallback(() => {
    console.log('Adding shift for selected date:', selectedDate);
    if (onAddShiftForDate && selectedDate) {
      onAddShiftForDate(selectedDate);
    }
  }, [onAddShiftForDate, selectedDate]);

  // Handle mobile case first to avoid conditional hook issues
  if (isMobile) {
    return (
      <div className="relative">
        <MobileShiftCalendarGrid
          shifts={shifts}
          onEditShift={onEditShift}
          onDeleteShift={onDeleteShift}
        />
        {(onAddShift || onAddShiftForDate) && (
          <Button
            onClick={handleAddShiftClick}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 relative">
      <StandardCard 
        title={t('shiftsCalendar')}
        description={t('weeklyShiftsView')}
        className="w-full"
      >
        <ShiftCalendarCarousel
          shifts={shifts}
          onEditShift={onEditShift}
          onDeleteShift={onDeleteShift}
        />
      </StandardCard>

      <StandardCard 
        title={t('shiftsCalendar')}
        description={t('clickDateToViewShifts')}
        className="w-full"
      >
        <div className="w-full max-w-none">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={getDateLocale()}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            components={components}
            className="w-full mx-auto [&_.rdp-table]:w-full [&_.rdp-months]:justify-center [&_.rdp-month]:w-full [&_.rdp-head_row]:grid [&_.rdp-head_row]:grid-cols-7 [&_.rdp-row]:grid [&_.rdp-row]:grid-cols-7 [&_.rdp-cell]:aspect-square [&_.rdp-day]:w-full [&_.rdp-day]:h-full"
          />
        </div>
      </StandardCard>

      {selectedDate && (
        <StandardCard 
          title={format(selectedDate, 'dd. MMMM yyyy', { locale: getDateLocale() })}
          description={selectedDateShifts.length === 0 
            ? t('noShiftsForThisDay')
            : `${selectedDateShifts.length} ${t('shifts').toLowerCase()}${selectedDateShifts.length > 1 ? 'y' : 'a'}`
          }
        >
          {selectedDateShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">{t('noShiftsPlannedForThisDay')}</p>
              {onAddShiftForDate && (
                <Button 
                  onClick={handleAddShiftForSelectedDate}
                  className="mt-4"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addShift')}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedDateShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Badge className={cn("text-xs flex-shrink-0", getShiftTypeColor(shift.type))}>
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
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shift.id && onDeleteShift(shift.id)}
                      className="h-7 w-7 p-0 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StandardCard>
      )}

      {/* Floating Add Button for Desktop */}
      {(onAddShift || onAddShiftForDate) && (
        <Button
          onClick={handleAddShiftClick}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default OptimizedShiftCalendar;
