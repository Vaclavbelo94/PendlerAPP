
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, isToday, isValid } from 'date-fns';
import { cs } from 'date-fns/locale';
import { CalendarDays, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Shift } from '@/types/shifts';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
  onAddShift?: (date?: Date) => void;
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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getShiftsForDate = useCallback((date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return isSameDay(shiftDate, date);
    });
  }, [shifts]);

  const selectedDateShift = useMemo(() => {
    if (!selectedDate) return null;
    const shiftsForDate = getShiftsForDate(selectedDate);
    return shiftsForDate.length > 0 ? shiftsForDate[0] : null;
  }, [selectedDate, getShiftsForDate]);

  const CustomDay = ({ date: dayDate, displayMonth, ...props }: any) => {
    if (!dayDate || !isValid(dayDate)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">?</span>
        </div>
      );
    }

    const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
    const isTodayDate = isToday(dayDate);
    const isCurrentMonth = dayDate.getMonth() === displayMonth.getMonth();
    const shiftsForDate = getShiftsForDate(dayDate);
    const hasShift = shiftsForDate.length > 0;
    
    return (
      <div className="relative w-full h-full">
        <button
          {...props}
          className={cn(
            "w-full h-full p-0 font-normal relative flex items-center justify-center",
            "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
            "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isTodayDate && !isSelected && "font-bold ring-2 ring-orange-400 ring-offset-1 bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 ring-2 ring-blue-500 ring-offset-2 font-semibold shadow-md",
            !isCurrentMonth && "text-muted-foreground opacity-50",
            isSelected && isTodayDate && "bg-blue-600 text-white ring-blue-500",
            hasShift && !isSelected && "bg-green-100 dark:bg-green-950/30 text-green-900 dark:text-green-100"
          )}
        >
          <span className="relative z-10">
            {dayDate.getDate()}
          </span>
          {hasShift && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full z-20"></div>
          )}
        </button>
      </div>
    );
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      case 'custom': return t('customShift');
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-500';
      case 'afternoon': return 'bg-amber-500';
      case 'night': return 'bg-indigo-500';
      case 'custom': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddShift = () => {
    console.log('OptimizedShiftCalendar - handleAddShift called, selectedDate:', selectedDate);
    if (selectedDate && onAddShiftForDate) {
      onAddShiftForDate(selectedDate);
    } else if (onAddShift) {
      onAddShift();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {t('shiftsCalendar')}
          </CardTitle>
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {t('shiftsCalendar')}
          </CardTitle>
          <Button
            onClick={handleAddShift}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('addShift')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          locale={cs}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          components={{
            Day: CustomDay
          }}
          className="w-full mx-auto"
        />
        
        {selectedDate && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">
                {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}
              </h3>
              {!selectedDateShift && (
                <Button
                  size="sm"
                  onClick={handleAddShift}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  {t('addShift')}
                </Button>
              )}
            </div>
            
            {selectedDateShift ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <div className={cn("w-3 h-3 rounded", getShiftTypeColor(selectedDateShift.type))}></div>
                    <Clock className="h-3 w-3" />
                    {getShiftTypeLabel(selectedDateShift.type)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedDateShift.start_time} - {selectedDateShift.end_time}
                  </span>
                </div>
                
                {selectedDateShift.notes && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {selectedDateShift.notes}
                  </p>
                )}
                
                <div className="flex gap-2">
                  {onEditShift && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditShift(selectedDateShift)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      {t('edit')}
                    </Button>
                  )}
                  {onDeleteShift && selectedDateShift.id && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteShift(selectedDateShift.id!)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      {t('delete')}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">{t('noShift')}</p>
                <Button
                  onClick={handleAddShift}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  {t('addShift')}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedShiftCalendar;
