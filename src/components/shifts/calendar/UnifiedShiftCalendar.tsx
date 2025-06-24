import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, CalendarDays, Edit, Trash2, Plus } from 'lucide-react';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShiftCalendarProps, Shift, ShiftType } from '@/types/shifts';
import { cn } from '@/lib/utils';
import { MobileCalendarGrid } from './MobileCalendarGrid';
import { useTranslation } from 'react-i18next';

interface ExtendedShiftCalendarProps extends ShiftCalendarProps {
  onAddShift?: (date?: Date) => void;
}

const UnifiedShiftCalendar: React.FC<ExtendedShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onSelectDate,
  onEditShift,
  onDeleteShift,
  onAddShift,
  isLoading = false,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const isMobile = useIsMobile();
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
    morning: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
    afternoon: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
    night: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
  } as const;

  const getShiftTypeLabel = (type: ShiftType) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      default: return type;
    }
  };

  const SHIFT_TIME_RANGES = {
    morning: '06:00 - 14:00',
    afternoon: '14:00 - 22:00',
    night: '22:00 - 06:00'
  } as const;

  // Memoized shift lookup for better performance
  const shiftsByDate = useMemo(() => {
    const lookup = new Map<string, Shift[]>();
    
    shifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'yyyy-MM-dd');
      if (!lookup.has(dateKey)) {
        lookup.set(dateKey, []);
      }
      lookup.get(dateKey)?.push(shift);
    });
    
    return lookup;
  }, [shifts]);

  // Get shifts for selected date
  const selectedDateShifts = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return shiftsByDate.get(dateKey) || [];
  }, [selectedDate, shiftsByDate]);

  // Calendar modifiers for highlighting shift days
  const modifiers = useMemo(() => {
    const datesWithShifts = Array.from(shiftsByDate.keys()).map(dateStr => new Date(dateStr));
    return {
      hasShift: datesWithShifts
    };
  }, [shiftsByDate]);

  const modifiersStyles = useMemo(() => ({
    hasShift: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      fontWeight: 'bold'
    }
  }), []);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    onSelectDate(today);
  }, [onSelectDate]);

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile layout with swipe support
  if (isMobile) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <MobileCalendarGrid
          currentDate={currentMonth}
          selectedDate={selectedDate}
          shifts={shifts}
          onDateSelect={onSelectDate}
          onMonthChange={setCurrentMonth}
        />
        
        {/* Selected date details for mobile */}
        {selectedDate && (
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {format(selectedDate, 'dd. MMMM yyyy', { locale: getDateLocale() })}
                </CardTitle>
                {onAddShift && (
                  <Button
                    onClick={() => onAddShift(selectedDate)}
                    size="sm"
                    className="h-8 px-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Přidat
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {selectedDateShifts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm mb-3">{t('noShiftsPlannedForThisDay')}</p>
                  {onAddShift && (
                    <Button 
                      onClick={() => onAddShift(selectedDate)}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Přidat první směnu
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateShifts.map((shift) => (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Badge className={cn("text-xs flex-shrink-0", SHIFT_TYPE_COLORS[shift.type])}>
                          {getShiftTypeLabel(shift.type)}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">
                            {SHIFT_TIME_RANGES[shift.type]}
                          </p>
                          {shift.notes && (
                            <p className="text-xs text-muted-foreground truncate">
                              {shift.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {(onEditShift || onDeleteShift) && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {onEditShift && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditShift(shift)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          {onDeleteShift && shift.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteShift(shift.id!)}
                              className="h-7 w-7 p-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Desktop layout - optimized for better usability
  return (
    <div className={cn("w-full max-w-7xl mx-auto space-y-8", className)}>
      {/* Main Calendar */}
      <Card className="bg-background border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-primary" />
              <span className="text-xl">{t('shiftsCalendar')}</span>
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousMonth}
                className="h-9 w-9 p-0"
                aria-label={t('previousMonth')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleTodayClick}
                className="px-4 py-2 text-sm font-medium"
              >
                {t('today')}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                className="h-9 w-9 p-0"
                aria-label={t('nextMonth')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-2xl font-semibold text-center mt-4">
            {format(currentMonth, 'LLLL yyyy', { locale: getDateLocale() })}
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <div className="bg-background rounded-lg border p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelectDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              locale={getDateLocale()}
              className="w-full mx-auto"
            />
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <div className="text-sm text-muted-foreground font-medium">{t('shiftTypesLegend')}:</div>
            {Object.entries(SHIFT_TYPE_COLORS).map(([type, colorClass]) => (
              <Badge 
                key={type}
                variant="secondary" 
                className={cn("text-sm px-3 py-1", colorClass)}
              >
                {getShiftTypeLabel(type as ShiftType)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="bg-background border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: getDateLocale() })}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {selectedDateShifts.length === 0 
                ? t('noShiftsForThisDay')
                : `${selectedDateShifts.length} ${selectedDateShifts.length > 1 ? t('shifts').toLowerCase() : t('shift')}`
              }
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {selectedDateShifts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarDays className="h-16 w-16 mx-auto mb-6 opacity-50" />
                <p className="text-lg">{t('noShiftsPlannedForThisDay')}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedDateShifts.map((shift) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Badge className={cn("text-sm flex-shrink-0 px-3 py-1", SHIFT_TYPE_COLORS[shift.type])}>
                        {getShiftTypeLabel(shift.type)}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {SHIFT_TIME_RANGES[shift.type]}
                        </p>
                        {shift.notes && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {shift.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    {(onEditShift || onDeleteShift) && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {onEditShift && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditShift(shift)}
                            className="h-8 w-8 p-0 hover:bg-accent"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteShift && shift.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteShift(shift.id!)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedShiftCalendar;
