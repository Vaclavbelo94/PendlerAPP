
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, isToday, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { cs } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Shift } from '@/types/shifts';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift: (date?: Date) => void;
  onAddShiftForDate: (date: Date) => void;
  isLoading?: boolean;
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onDateChange,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  isLoading = false
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Memoized shift lookup for performance
  const shiftsByDate = useMemo(() => {
    const lookup = new Map<string, Shift[]>();
    shifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'yyyy-MM-dd');
      if (!lookup.has(dateKey)) {
        lookup.set(dateKey, []);
      }
      lookup.get(dateKey)!.push(shift);
    });
    return lookup;
  }, [shifts]);

  // Get shifts for a specific date
  const getShiftsForDate = (date: Date): Shift[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return shiftsByDate.get(dateKey) || [];
  };

  // Get shift type color
  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'afternoon': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'night': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'custom': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get shift type label
  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpoledne';
      case 'night': return 'Noční';
      case 'custom': return 'Vlastní';
      default: return type;
    }
  };

  // Custom day component with shift indicators
  const CustomDay = ({ date: dayDate, displayMonth, ...props }: any) => {
    const shiftsForDay = getShiftsForDate(dayDate);
    const isSelected = isSameDay(dayDate, selectedDate);
    const isTodayDate = isToday(dayDate);
    const isCurrentMonth = dayDate.getMonth() === displayMonth.getMonth();
    const hasShifts = shiftsForDay.length > 0;

    return (
      <div className="relative w-full h-full">
        <button
          {...props}
          className={cn(
            "w-full h-full p-0 font-normal relative flex flex-col items-center justify-center min-h-[40px]",
            "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
            "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Today styling
            isTodayDate && !isSelected && "font-bold ring-2 ring-orange-400 ring-offset-1 bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100",
            // Selected styling
            isSelected && "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 ring-2 ring-blue-500 ring-offset-2 font-semibold shadow-md",
            // Current month vs other months
            !isCurrentMonth && "text-muted-foreground opacity-50",
            // Ensure selected overrides today
            isSelected && isTodayDate && "bg-blue-600 text-white ring-blue-500"
          )}
        >
          <span className="relative z-10 text-sm">
            {dayDate.getDate()}
          </span>
          {hasShifts && (
            <div className="flex gap-1 mt-1">
              {shiftsForDay.slice(0, 3).map((shift, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    shift.type === 'morning' && "bg-blue-500",
                    shift.type === 'afternoon' && "bg-amber-500",
                    shift.type === 'night' && "bg-indigo-500",
                    shift.type === 'custom' && "bg-gray-500",
                    isSelected && "bg-white"
                  )}
                />
              ))}
              {shiftsForDay.length > 3 && (
                <div className={cn(
                  "text-xs",
                  isSelected ? "text-white" : "text-muted-foreground"
                )}>
                  +{shiftsForDay.length - 3}
                </div>
              )}
            </div>
          )}
        </button>
      </div>
    );
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateChange(today);
  };

  // Get shifts for selected date
  const selectedDateShifts = getShiftsForDate(selectedDate);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Kalendář směn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Načítání kalendáře...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Kalendář směn
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Dnes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShift()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Přidat směnu
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Custom month navigation */}
          <div className="flex items-center justify-between p-4 border-b">
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold">
              {format(currentMonth, 'LLLL yyyy', { locale: cs })}
            </h3>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex flex-wrap gap-4 items-center justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded ring-2 ring-orange-400 bg-orange-50 dark:bg-orange-950/30"></div>
                <span className="text-muted-foreground">Dnes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-600"></div>
                <span className="text-muted-foreground">Vybraný den</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Ranní</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-muted-foreground">Odpolední</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-muted-foreground">Noční</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span className="text-muted-foreground">Vlastní</span>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              components={{
                Day: CustomDay
              }}
              locale={cs}
              className="w-full mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected date details */}
      {selectedDateShifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Směny pro {format(selectedDate, 'dd. MMMM yyyy', { locale: cs })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getShiftTypeColor(shift.type)}>
                      {getShiftTypeLabel(shift.type)}
                    </Badge>
                    <div>
                      <div className="font-medium">
                        {shift.start_time} - {shift.end_time}
                      </div>
                      {shift.notes && (
                        <div className="text-sm text-muted-foreground">
                          {shift.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditShift(shift)}
                    >
                      Upravit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shift.id && onDeleteShift(shift.id)}
                    >
                      Smazat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add shift for selected date */}
      {selectedDateShifts.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground mb-4">
              Žádné směny pro {format(selectedDate, 'dd. MMMM yyyy', { locale: cs })}
            </div>
            <Button onClick={() => onAddShiftForDate(selectedDate)}>
              <Plus className="h-4 w-4 mr-2" />
              Přidat směnu pro tento den
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedShiftCalendar;
