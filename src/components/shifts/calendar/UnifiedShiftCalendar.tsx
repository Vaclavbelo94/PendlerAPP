import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Edit, Trash2, Plus, Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift, ShiftCalendarProps } from '@/types/shifts';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUnifiedOrientation } from '@/hooks/useUnifiedOrientation';

const UnifiedShiftCalendar: React.FC<ShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onSelectDate,
  onEditShift,
  onDeleteShift,
  isLoading = false,
  className
}) => {
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(selectedDate || new Date());
  const isMobile = useIsMobile();
  const { isTablet, isDesktop } = useUnifiedOrientation();

  const currentSelectedDate = selectedDate || internalSelectedDate;

  const handleDateSelect = (date: Date | undefined) => {
    setInternalSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date);
    }
  };

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
    if (!currentSelectedDate) return [];
    const dateKey = format(currentSelectedDate, 'yyyy-MM-dd');
    return shiftsMap.get(dateKey) || [];
  }, [currentSelectedDate, shiftsMap]);

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední';
      case 'night': return 'Noční';
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'afternoon': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'night': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const modifiers = useMemo(() => ({
    hasShift: (date: Date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      return shiftsMap.has(dateKey);
    }
  }), [shiftsMap]);

  const modifiersClassNames = {
    hasShift: 'bg-primary/20 font-bold'
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mobile layout remains the same
  if (isMobile) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
          <div className="p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Kalendář směn
            </h2>
          </div>
          <div className="p-4">
            <Calendar
              mode="single"
              selected={currentSelectedDate}
              onSelect={handleDateSelect}
              locale={cs}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="w-full"
            />
          </div>
        </div>

        {currentSelectedDate && (
          <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold">
                {format(currentSelectedDate, 'dd. MMMM yyyy', { locale: cs })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedDateShifts.length === 0 
                  ? 'Žádné směny pro tento den'
                  : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
                }
              </p>
            </div>
            <div className="p-4">
              {selectedDateShifts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Pro tento den nejsou naplánované žádné směny</p>
                </div>
              ) : (
                <div className="space-y-3">
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop and tablet layout with optimized proportions
  return (
    <div className={cn("w-full", className)}>
      {/* Ultra-wide screens (2XL+): Full width calendar with details below */}
      <div className="hidden 2xl:block">
        <div className="space-y-8">
          {/* Full width calendar */}
          <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl">
            <div className="p-8 border-b border-border/50">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <CalendarDays className="h-7 w-7" />
                Kalendář směn
              </h2>
              <p className="text-muted-foreground mt-2">Klikněte na datum pro zobrazení směn</p>
            </div>
            <div className="p-8">
              <Calendar
                mode="single"
                selected={currentSelectedDate}
                onSelect={handleDateSelect}
                locale={cs}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="w-full mx-auto"
              />
            </div>
          </div>

          {/* Details below calendar */}
          {currentSelectedDate && (
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl">
              <div className="p-8 border-b border-border/50">
                <h3 className="text-xl font-semibold">
                  {format(currentSelectedDate, 'dd. MMMM yyyy', { locale: cs })}
                </h3>
                <p className="text-muted-foreground">
                  {selectedDateShifts.length === 0 
                    ? 'Žádné směny pro tento den'
                    : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
                  }
                </p>
              </div>
              <div className="p-8">
                {selectedDateShifts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-16 w-16 mx-auto mb-6 opacity-50" />
                    <p className="text-lg">Pro tento den nejsou naplánované žádné směny</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {selectedDateShifts.map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Badge className={cn("text-sm flex-shrink-0", getShiftTypeColor(shift.type))}>
                            {getShiftTypeLabel(shift.type)}
                          </Badge>
                          {shift.notes && (
                            <span className="text-sm text-muted-foreground truncate">
                              {shift.notes}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {onEditShift && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditShift(shift)}
                              className="h-8 w-8 p-0"
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop and XL screens: Two column layout with better proportions */}
      <div className="hidden lg:block 2xl:hidden">
        <div className="grid grid-cols-5 gap-8 h-full">
          {/* Calendar column - 3/5 of width */}
          <div className="col-span-3">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl h-full">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CalendarDays className="h-6 w-6" />
                  Kalendář směn
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Klikněte na datum pro zobrazení směn</p>
              </div>
              <div className="p-6">
                <Calendar
                  mode="single"
                  selected={currentSelectedDate}
                  onSelect={handleDateSelect}
                  locale={cs}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Details column - 2/5 of width */}
          <div className="col-span-2">
            {currentSelectedDate && (
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl h-full">
                <div className="p-6 border-b border-border/50">
                  <h3 className="font-semibold">
                    {format(currentSelectedDate, 'dd. MMMM yyyy', { locale: cs })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDateShifts.length === 0 
                      ? 'Žádné směny pro tento den'
                      : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
                    }
                  </p>
                </div>
                <ScrollArea className="h-[calc(100%-theme(spacing.24))]">
                  <div className="p-6">
                    {selectedDateShifts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Pro tento den nejsou naplánované žádné směny</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedDateShifts.map((shift) => (
                          <div key={shift.id} className="p-4 border rounded-xl bg-muted/30">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={cn("text-xs", getShiftTypeColor(shift.type))}>
                                {getShiftTypeLabel(shift.type)}
                              </Badge>
                            </div>
                            {shift.notes && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {shift.notes}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              {onEditShift && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEditShift(shift)}
                                  className="h-8 px-3 text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Upravit
                                </Button>
                              )}
                              {onDeleteShift && shift.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDeleteShift(shift.id!)}
                                  className="h-8 px-3 text-xs hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Smazat
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tablet layout */}
      <div className="block lg:hidden">
        <div className="space-y-6">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
            <div className="p-4 border-b border-border/50">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Kalendář směn
              </h2>
              <p className="text-muted-foreground text-sm">Klikněte na datum pro zobrazení směn</p>
            </div>
            <div className="p-4">
              <Calendar
                mode="single"
                selected={currentSelectedDate}
                onSelect={handleDateSelect}
                locale={cs}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="w-full"
              />
            </div>
          </div>

          {currentSelectedDate && (
            <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold">
                  {format(currentSelectedDate, 'dd. MMMM yyyy', { locale: cs })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDateShifts.length === 0 
                    ? 'Žádné směny pro tento den'
                    : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
                  }
                </p>
              </div>
              <div className="p-4">
                {selectedDateShifts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-10 w-10 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Pro tento den nejsou naplánované žádné směny</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedShiftCalendar;
