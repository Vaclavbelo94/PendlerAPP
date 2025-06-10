
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileShiftCalendarGrid } from './mobile/MobileShiftCalendarGrid';
import { StandardCard } from '@/components/ui/StandardCard';

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
  const isMobile = useIsMobile();

  // If mobile, use the mobile calendar grid
  if (isMobile) {
    return (
      <MobileShiftCalendarGrid
        shifts={shifts}
        onEditShift={onEditShift}
        onDeleteShift={onDeleteShift}
      />
    );
  }

  // Desktop layout - full width calendar with side details
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Calendar Card - takes 2/3 on desktop */}
      <div className="lg:col-span-2">
        <StandardCard 
          title="Kalendář směn"
          description="Klikněte na datum pro zobrazení směn"
          className="h-full"
        >
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={cs}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border w-full scale-110 origin-center"
            />
          </div>
        </StandardCard>
      </div>

      {/* Selected Date Details - takes 1/3 on desktop */}
      <div className="lg:col-span-1">
        <StandardCard 
          title={selectedDate 
            ? format(selectedDate, 'dd. MMMM yyyy', { locale: cs })
            : 'Vyberte datum'
          }
          description={selectedDateShifts.length === 0 
            ? 'Žádné směny pro tento den'
            : `${selectedDateShifts.length} směn${selectedDateShifts.length > 1 ? 'y' : 'a'}`
          }
          className="h-full"
        >
          {selectedDateShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
      </div>
    </div>
  );
};

export default OptimizedShiftCalendar;
