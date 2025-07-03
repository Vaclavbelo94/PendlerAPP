
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
    // Simplified validation - just check if dayDate exists and is a valid Date
    if (!dayDate || !(dayDate instanceof Date) || isNaN(dayDate.getTime())) {
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <span className="text-muted-foreground text-sm">-</span>
        </div>
      );
    }

    const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
    const isTodayDate = isToday(dayDate);
    const isCurrentMonth = displayMonth && dayDate.getMonth() === displayMonth.getMonth();
    const shiftsForDate = getShiftsForDate(dayDate);
    const hasShift = shiftsForDate.length > 0;
    
    return (
      <div className="relative w-full h-full min-h-[32px]">
        <button
          {...props}
          className={cn(
            "w-full h-full p-1 font-normal relative flex items-center justify-center rounded-md transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            isTodayDate && !isSelected && "font-bold ring-2 ring-orange-400 ring-offset-1 bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 ring-2 ring-blue-500 ring-offset-1 font-semibold shadow-md",
            !isCurrentMonth && "text-muted-foreground opacity-50",
            isSelected && isTodayDate && "bg-blue-600 text-white ring-blue-500",
            hasShift && !isSelected && "bg-green-100 dark:bg-green-950/30 text-green-900 dark:text-green-100 font-medium"
          )}
        >
          <span className="relative z-10 text-sm">
            {dayDate.getDate()}
          </span>
          {hasShift && (
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full z-20 shadow-sm"></div>
          )}
        </button>
      </div>
    );
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morningShift') || 'Ranní směna';
      case 'afternoon': return t('afternoonShift') || 'Odpolední směna';
      case 'night': return t('nightShift') || 'Noční směna';
      case 'custom': return t('customShift') || 'Vlastní směna';
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
            {t('shiftsCalendar') || 'Kalendář směn'}
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
            {t('shiftsCalendar') || 'Kalendář směn'}
          </CardTitle>
          <Button
            onClick={handleAddShift}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('addShift') || 'Přidat směnu'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
          className="w-full mx-auto border rounded-md p-3"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center p-2",
            row: "flex w-full mt-2",
            cell: "text-center text-sm relative p-0 focus-within:relative focus-within:z-20 flex-1 min-h-[32px]",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
        
        {selectedDate && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-base">
                {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}
              </h3>
              {!selectedDateShift && (
                <Button
                  size="sm"
                  onClick={handleAddShift}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  {t('addShift') || 'Přidat směnu'}
                </Button>
              )}
            </div>
            
            {selectedDateShift ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <div className={cn("w-3 h-3 rounded", getShiftTypeColor(selectedDateShift.type))}></div>
                    <Clock className="h-3 w-3" />
                    {getShiftTypeLabel(selectedDateShift.type)}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-mono">
                    {selectedDateShift.start_time} - {selectedDateShift.end_time}
                  </span>
                </div>
                
                {selectedDateShift.notes && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border-l-4 border-primary/20">
                    {selectedDateShift.notes}
                  </p>
                )}
                
                <div className="flex gap-2 pt-2">
                  {onEditShift && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditShift(selectedDateShift)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      {t('editShift') || 'Upravit'}
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
                      {t('deleteShift') || 'Smazat'}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('noShift') || 'Žádná směna'}
                </p>
                <Button
                  onClick={handleAddShift}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  {t('addShift') || 'Přidat směnu'}
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
