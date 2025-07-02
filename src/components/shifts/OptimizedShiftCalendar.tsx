import React, { useState, useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, Edit, Trash2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Shift } from '@/types/shifts';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
  onAddShift?: () => void;
  onAddShiftForDate?: (date: Date) => void;
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
  const { t } = useTranslation('shifts');
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(selectedDate || new Date());

  const currentDate = selectedDate || internalSelectedDate;

  const handleDateSelect = useCallback((date: Date) => {
    if (onDateChange) {
      onDateChange(date);
    } else {
      setInternalSelectedDate(date);
    }
  }, [onDateChange]);

  const shiftsForSelectedDate = useMemo(() => {
    return shifts.filter(shift => 
      isSameDay(new Date(shift.date), currentDate)
    );
  }, [shifts, currentDate]);

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-yellow-500';
      case 'afternoon': return 'bg-blue-500';
      case 'night': return 'bg-purple-500';
      case 'custom': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morning');
      case 'afternoon': return t('afternoon');
      case 'night': return t('night');
      case 'custom': return t('custom');
      default: return type;
    }
  };

  const modifiers = useMemo(() => {
    const shiftDates = shifts.map(shift => new Date(shift.date));
    return {
      hasShift: shiftDates
    };
  }, [shifts]);

  const modifiersClassNames = {
    hasShift: 'bg-primary/20 text-primary-foreground font-semibold'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {t('shiftCalendar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => date && handleDateSelect(date)}
            locale={cs}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {t('shiftsFor')} {format(currentDate, 'dd.MM.yyyy', { locale: cs })}
            </CardTitle>
            <Button
              onClick={() => onAddShiftForDate?.(currentDate)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addShift')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {shiftsForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('noShiftsForDay')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shiftsForSelectedDate.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`${getShiftTypeColor(shift.type)} text-white`}
                    >
                      {getShiftTypeLabel(shift.type)}
                    </Badge>
                    <div>
                      <p className="font-medium">
                        {shift.start_time} - {shift.end_time}
                      </p>
                      {shift.notes && (
                        <p className="text-sm text-muted-foreground">
                          {shift.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditShift?.(shift)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteShift?.(shift.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
