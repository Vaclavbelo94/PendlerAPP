import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, CalendarDays, Edit, Trash2 } from 'lucide-react';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useUnifiedOrientation } from '@/hooks/useUnifiedOrientation';
import { ShiftCalendarProps, Shift, ShiftType } from '@/types/shifts';
import { cn } from '@/lib/utils';
import { MobileCalendarGrid } from './MobileCalendarGrid';

const SHIFT_TYPE_COLORS = {
  morning: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  afternoon: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  night: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
} as const;

const SHIFT_TYPE_LABELS = {
  morning: 'Ranní',
  afternoon: 'Odpolední', 
  night: 'Noční'
} as const;

const SHIFT_TIME_RANGES = {
  morning: '06:00 - 14:00',
  afternoon: '14:00 - 22:00',
  night: '22:00 - 06:00'
} as const;

const UnifiedShiftCalendar: React.FC<ShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onSelectDate,
  onEditShift,
  onDeleteShift,
  isLoading = false,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { isMobile, isTablet, isDesktop } = useUnifiedOrientation();

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

  // Mobile layout
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
              <CardTitle className="text-lg">
                {format(selectedDate, 'dd. MMMM yyyy', { locale: cs })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {selectedDateShifts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Pro tento den nejsou naplánované žádné směny</p>
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
                          {SHIFT_TYPE_LABELS[shift.type]}
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

  // Desktop and Tablet layout
  const cardPadding = isTablet ? "px-6 pb-6" : "px-10 pb-10";
  const headerPadding = isTablet ? "pb-6" : "pb-8";
  const calendarPadding = isTablet ? "p-4" : "p-6";
  const titleSize = isTablet ? "text-xl" : "text-2xl";
  const monthSize = isTablet ? "text-2xl" : "text-3xl";

  return (
    <div className={cn("w-full max-w-7xl mx-auto space-y-6", className)}>
      {/* Main Calendar */}
      <Card className="bg-white/95 backdrop-blur-sm border shadow-xl">
        <CardHeader className={headerPadding}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-4 ${titleSize}`}>
              <CalendarDays className="h-6 w-6 text-primary" />
              <span>Kalendář směn</span>
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size={isTablet ? "default" : "default"}
                onClick={handlePreviousMonth}
                className="h-10 w-10 p-0"
                aria-label="Předchozí měsíc"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size={isTablet ? "sm" : "default"}
                onClick={handleTodayClick}
                className={isTablet ? "px-4 py-2 text-sm" : "px-6 py-3 text-base font-medium"}
              >
                Dnes
              </Button>
              
              <Button
                variant="outline"
                size={isTablet ? "default" : "default"}
                onClick={handleNextMonth}
                className="h-10 w-10 p-0"
                aria-label="Následující měsíc"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className={`${monthSize} font-semibold text-center mt-4`}>
            {format(currentMonth, 'LLLL yyyy', { locale: cs })}
          </div>
        </CardHeader>
        
        <CardContent className={cardPadding}>
          <div className={`bg-background/90 rounded-lg border-2 ${calendarPadding} shadow-inner`}>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelectDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              locale={cs}
              className="w-full mx-auto"
            />
          </div>
          
          {/* Legend */}
          <div className={`${isTablet ? 'mt-6' : 'mt-8'} flex flex-wrap gap-3 justify-center`}>
            <div className={`${isTablet ? 'text-sm' : 'text-base'} text-muted-foreground font-semibold`}>
              Legenda směn:
            </div>
            {Object.entries(SHIFT_TYPE_LABELS).map(([type, label]) => (
              <Badge 
                key={type}
                variant="secondary" 
                className={cn(
                  isTablet ? "text-sm px-3 py-1" : "text-base px-4 py-2", 
                  SHIFT_TYPE_COLORS[type as ShiftType]
                )}
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="bg-white/95 backdrop-blur-sm border shadow-xl">
          <CardHeader className={`${headerPadding} pb-4`}>
            <CardTitle className={titleSize}>
              {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: cs })}
            </CardTitle>
            <div className={`${isTablet ? 'text-sm' : 'text-base'} text-muted-foreground`}>
              {selectedDateShifts.length === 0 
                ? 'Žádné směny pro tento den'
                : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
              }
            </div>
          </CardHeader>
          <CardContent className={cardPadding}>
            {selectedDateShifts.length === 0 ? (
              <div className={`text-center ${isTablet ? 'py-12' : 'py-16'} text-muted-foreground`}>
                <CalendarDays className={`${isTablet ? 'h-16 w-16' : 'h-20 w-20'} mx-auto ${isTablet ? 'mb-6' : 'mb-8'} opacity-50`} />
                <p className={isTablet ? 'text-lg' : 'text-xl'}>Pro tento den nejsou naplánované žádné směny</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${isTablet ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                {selectedDateShifts.map((shift) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between ${isTablet ? 'p-4' : 'p-6'} border-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Badge className={cn(
                        isTablet ? "text-sm flex-shrink-0 px-3 py-1" : "text-base flex-shrink-0 px-4 py-2", 
                        SHIFT_TYPE_COLORS[shift.type]
                      )}>
                        {SHIFT_TYPE_LABELS[shift.type]}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className={`${isTablet ? 'text-sm' : 'text-base'} font-medium text-muted-foreground`}>
                          {SHIFT_TIME_RANGES[shift.type]}
                        </p>
                        {shift.notes && (
                          <p className={`${isTablet ? 'text-sm' : 'text-base'} text-muted-foreground truncate mt-1`}>
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
