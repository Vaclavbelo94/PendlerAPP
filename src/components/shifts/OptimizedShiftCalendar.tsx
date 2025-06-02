
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { cn } from '@/lib/utils';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Kalendář */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" />
            Kalendář směn
          </CardTitle>
          <CardDescription className="text-sm">
            Klikněte na datum pro zobrazení směn
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 lg:p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={cs}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className={cn(
              "rounded-md border w-full",
              // Mobile optimizations
              "text-sm md:text-base",
              "[&_.rdp-day]:h-8 [&_.rdp-day]:w-8 md:[&_.rdp-day]:h-10 md:[&_.rdp-day]:w-10",
              "[&_.rdp-day]:text-xs md:[&_.rdp-day]:text-sm"
            )}
          />
        </CardContent>
      </Card>

      {/* Detail směny */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {selectedDate 
              ? format(selectedDate, 'dd. MMMM yyyy', { locale: cs })
              : 'Vyberte datum'
            }
          </CardTitle>
          <CardDescription className="text-sm">
            {selectedDateShifts.length === 0 
              ? 'Žádné směny pro tento den'
              : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 lg:p-6">
          {selectedDateShifts.length === 0 ? (
            <div className="text-center py-6 lg:py-8 text-muted-foreground">
              <CalendarDays className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 lg:mb-4 opacity-50" />
              <p className="text-sm lg:text-base">Pro tento den nejsou naplánované žádné směny</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 lg:p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                    <Badge className={cn("text-xs flex-shrink-0", getShiftTypeColor(shift.type))}>
                      {getShiftTypeLabel(shift.type)}
                    </Badge>
                    {shift.notes && (
                      <span className="text-xs lg:text-sm text-muted-foreground truncate">
                        {shift.notes}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditShift(shift)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shift.id && onDeleteShift(shift.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedShiftCalendar;
