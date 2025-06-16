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

  // Desktop and Tablet layout with improved 2-column design
  return (
    <div className={cn("w-full max-w-7xl mx-auto space-y-6", className)}>
      {isDesktop ? (
        // Desktop: Side-by-side layout
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Calendar - takes 2/3 width on xl screens */}
          <div className="xl:col-span-2">
            <Card className="bg-background/80 backdrop-blur-sm border shadow-xl h-fit">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-4 text-2xl">
                    <CalendarDays className="h-6 w-6 text-primary" />
                    <span>Kalendář směn</span>
                  </CardTitle>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handlePreviousMonth}
                      className="h-10 w-10 p-0"
                      aria-label="Předchozí měsíc"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleTodayClick}
                      className="px-6 py-3 text-base font-medium"
                    >
                      Dnes
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleNextMonth}
                      className="h-10 w-10 p-0"
                      aria-label="Následující měsíc"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-3xl font-semibold text-center mt-4">
                  {format(currentMonth, 'LLLL yyyy', { locale: cs })}
                </div>
              </CardHeader>
              
              <CardContent className="px-10 pb-10">
                <div className="bg-background/90 rounded-lg border-2 p-6 shadow-inner">
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
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <div className="text-base text-muted-foreground font-semibold">
                    Legenda směn:
                  </div>
                  {Object.entries(SHIFT_TYPE_LABELS).map(([type, label]) => (
                    <Badge 
                      key={type}
                      variant="secondary" 
                      className={cn("text-base px-4 py-2", SHIFT_TYPE_COLORS[type as ShiftType])}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details - takes 1/3 width on xl screens */}
          <div className="xl:col-span-1">
            {selectedDate && (
              <Card className="bg-background/80 backdrop-blur-sm border shadow-xl h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">
                    {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: cs })}
                  </CardTitle>
                  <div className="text-base text-muted-foreground">
                    {selectedDateShifts.length === 0 
                      ? 'Žádné směny pro tento den'
                      : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
                    }
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {selectedDateShifts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarDays className="h-16 w-16 mx-auto mb-6 opacity-50" />
                      <p className="text-lg">Pro tento den nejsou naplánované žádné směny</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDateShifts.map((shift) => (
                        <motion.div
                          key={shift.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-3 p-4 border-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <Badge className={cn("text-sm px-3 py-1", SHIFT_TYPE_COLORS[shift.type])}>
                              {SHIFT_TYPE_LABELS[shift.type]}
                            </Badge>
                            {(onEditShift || onDeleteShift) && (
                              <div className="flex items-center gap-2">
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
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {SHIFT_TIME_RANGES[shift.type]}
                            </p>
                            {shift.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {shift.notes}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        // Tablet: Stacked layout with optimized spacing
        <div className="space-y-6">
          {/* Main Calendar */}
          <Card className="bg-background/80 backdrop-blur-sm border shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-4 text-xl">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  <span>Kalendář směn</span>
                </CardTitle>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handlePreviousMonth}
                    className="h-10 w-10 p-0"
                    aria-label="Předchozí měsíc"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTodayClick}
                    className="px-4 py-2 text-sm"
                  >
                    Dnes
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleNextMonth}
                    className="h-10 w-10 p-0"
                    aria-label="Následující měsíc"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-2xl font-semibold text-center mt-4">
                {format(currentMonth, 'LLLL yyyy', { locale: cs })}
              </div>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <div className="bg-background/90 rounded-lg border-2 p-4 shadow-inner">
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
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <div className="text-sm text-muted-foreground font-semibold">
                  Legenda směn:
                </div>
                {Object.entries(SHIFT_TYPE_LABELS).map(([type, label]) => (
                  <Badge 
                    key={type}
                    variant="secondary" 
                    className={cn("text-sm px-3 py-1", SHIFT_TYPE_COLORS[type as ShiftType])}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          {selectedDate && (
            <Card className="bg-background/80 backdrop-blur-sm border shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">
                  {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: cs })}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {selectedDateShifts.length === 0 
                    ? 'Žádné směny pro tento den'
                    : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
                  }
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {selectedDateShifts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarDays className="h-16 w-16 mx-auto mb-6 opacity-50" />
                    <p className="text-lg">Pro tento den nejsou naplánované žádné směny</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedDateShifts.map((shift) => (
                      <motion.div
                        key={shift.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 border-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Badge className={cn("text-sm flex-shrink-0 px-3 py-1", SHIFT_TYPE_COLORS[shift.type])}>
                            {SHIFT_TYPE_LABELS[shift.type]}
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
      )}
    </div>
  );
};

export default UnifiedShiftCalendar;
