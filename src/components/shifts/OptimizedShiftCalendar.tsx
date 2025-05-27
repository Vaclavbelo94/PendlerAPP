
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { cn } from '@/lib/utils';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = React.memo(({
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Memoize shifts for selected date to prevent unnecessary recalculations
  const selectedShifts = useMemo(() => {
    if (!selectedDate) return [];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.toDateString() === selectedDate.toDateString();
    });
  }, [shifts, selectedDate]);

  // Memoize dates with shifts for calendar modifiers
  const datesWithShifts = useMemo(() => {
    return shifts.map(shift => new Date(shift.date));
  }, [shifts]);

  // Memoize calendar modifiers
  const calendarModifiers = useMemo(() => ({
    hasShift: datesWithShifts
  }), [datesWithShifts]);

  // Memoize modifiers styles
  const modifiersStyles = useMemo(() => ({
    hasShift: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'white',
      fontWeight: 'bold'
    }
  }), []);

  // Stabilized callbacks
  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  const handleEditShift = useCallback((shift: Shift) => {
    onEditShift(shift);
  }, [onEditShift]);

  const handleDeleteShift = useCallback((shiftId: string) => {
    onDeleteShift(shiftId);
  }, [onDeleteShift]);

  const getShiftTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'morning':
        return 'Ranní směna';
      case 'afternoon':
        return 'Odpolední směna';
      case 'night':
        return 'Noční směna';
      default:
        return type;
    }
  }, []);

  const getShiftTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-orange-500';
      case 'afternoon':
        return 'bg-blue-500';
      case 'night':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Kalendář směn
          </CardTitle>
          <CardDescription>
            Vyberte datum pro zobrazení směn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={calendarModifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'EEEE, d. MMMM yyyy', { locale: cs }) : 'Vyberte datum'}
          </CardTitle>
          <CardDescription>
            {selectedShifts.length > 0 
              ? `${selectedShifts.length} směna${selectedShifts.length > 1 ? 'y' : ''}`
              : 'Žádné směny'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Na tento den nemáte naplánované žádné směny</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-3 h-3 rounded-full", getShiftTypeColor(shift.type))} />
                    <div>
                      <Badge variant="secondary">
                        {getShiftTypeLabel(shift.type)}
                      </Badge>
                      {shift.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {shift.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditShift(shift)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => shift.id && handleDeleteShift(shift.id)}
                    >
                      <Trash className="h-4 w-4" />
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
});

OptimizedShiftCalendar.displayName = 'OptimizedShiftCalendar';

export default OptimizedShiftCalendar;
