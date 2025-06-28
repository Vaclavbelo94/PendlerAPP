import React, { useState, useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2, Plus } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
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
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate
}) => {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - NO CONDITIONAL HOOKS
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'carousel'>('carousel');
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

  const modifiers = useMemo(() => ({
    hasShift: (date: Date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      return shiftsMap.has(dateKey);
    }
  }), [shiftsMap]);

  const modifiersClassNames = useMemo(() => ({
    hasShift: 'bg-primary/20 font-bold'
  }), []);

  // Oprava: Při kliknutí na tlačítko + použít skutečně vybrané datum
  const handleAddShiftClick = useCallback(() => {
    console.log('Add shift clicked with selected date:', selectedDate);
    if (onAddShiftForDate && selectedDate) {
      onAddShiftForDate(selectedDate);
    } else if (onAddShift) {
      onAddShift();
    }
  }, [onAddShiftForDate, onAddShift, selectedDate]);

  // Oprava: Při kliknutí na "Přidat směnu" v prázdném datu použít vybrané datum
  const handleAddShiftForSelectedDate = useCallback(() => {
    console.log('Adding shift for selected date:', selectedDate);
    if (onAddShiftForDate && selectedDate) {
      onAddShiftForDate(selectedDate);
    }
  }, [onAddShiftForDate, selectedDate]);

  // Oprava: Při změně vybraného data v kalendáři resetovat selectedDateForNewShift
  const handleDateSelect = useCallback((date: Date | undefined) => {
    console.log('Calendar date selected:', date);
    setSelectedDate(date);
  }, []);

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
      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'carousel' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('carousel')}
        >
          {t('weeklyView')}
        </Button>
        <Button
          variant={viewMode === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('calendar')}
        >
          {t('monthlyView')}
        </Button>
      </div>

      {viewMode === 'carousel' ? (
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
      ) : (
        <>
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
        </>
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
