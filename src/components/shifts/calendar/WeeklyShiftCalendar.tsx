
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, addWeeks, subWeeks } from 'date-fns';
import { cs } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock } from 'lucide-react';
import { Shift } from '@/types/shifts';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface WeeklyShiftCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift: (date?: Date) => void;
  isLoading?: boolean;
}

const WeeklyShiftCalendar: React.FC<WeeklyShiftCalendarProps> = ({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  isLoading = false
}) => {
  const { t } = useTranslation('shifts');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = useMemo(() => startOfWeek(currentWeek, { weekStartsOn: 1 }), [currentWeek]);
  const weekEnd = useMemo(() => endOfWeek(currentWeek, { weekStartsOn: 1 }), [currentWeek]);
  const weekDays = useMemo(() => eachDayOfInterval({ start: weekStart, end: weekEnd }), [weekStart, weekEnd]);

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return isSameDay(shiftDate, date);
    });
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

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      case 'custom': return t('customShift');
      default: return type;
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const handleAddShiftForDate = (date: Date) => {
    console.log('WeeklyShiftCalendar - Adding shift for date:', date);
    onAddShift(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {t('weeklyView')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" />
            {t('weeklyView')}
          </CardTitle>
          
          {/* Week Navigation - Mobile Optimized */}
          <div className="flex items-center justify-between sm:justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousWeek}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-sm font-medium text-center min-w-0 flex-1 sm:min-w-[180px] sm:flex-none px-2">
              <div className="truncate">
                {format(weekStart, 'd. MMM', { locale: cs })} - {format(weekEnd, 'd. MMM yyyy', { locale: cs })}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Mobile: Single column, Desktop: 7 columns */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-7 sm:gap-3">
          {weekDays.map((day) => {
            const dayShifts = getShiftsForDate(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "border rounded-lg p-3 min-h-[120px] sm:min-h-[150px] bg-card transition-colors",
                  isCurrentDay && "ring-2 ring-orange-400 bg-orange-50 dark:bg-orange-950/30",
                  "hover:bg-accent/30"
                )}
              >
                {/* Day header - Mobile optimized */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1">
                    <div className="text-sm font-medium sm:text-xs sm:text-muted-foreground sm:uppercase">
                      {format(day, 'EEEE', { locale: cs })}
                    </div>
                    <div className={cn(
                      "text-xl font-bold sm:text-lg",
                      isCurrentDay && "text-orange-600 dark:text-orange-400"
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  
                  {/* Add shift button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddShiftForDate(day)}
                    className="h-8 w-8 p-0 opacity-70 hover:opacity-100 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Shifts for this day */}
                <div className="space-y-2">
                  {dayShifts.length === 0 ? (
                    <div className="text-center py-3 sm:py-4">
                      <p className="text-sm text-muted-foreground mb-2">{t('noShift')}</p>
                      <Button
                        variant="outline"
                        size="sm" 
                        onClick={() => handleAddShiftForDate(day)}
                        className="text-xs h-8"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t('addShift')}
                      </Button>
                    </div>
                  ) : (
                    dayShifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="bg-background border rounded-md p-2 shadow-sm space-y-2"
                      >
                        {/* Shift type and actions */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={cn("text-white text-xs font-medium", getShiftTypeColor(shift.type))}
                          >
                            {getShiftTypeLabel(shift.type)}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditShift(shift)}
                              className="h-6 w-6 p-0 hover:bg-muted"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => shift.id && onDeleteShift(shift.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Time */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="font-mono">{shift.start_time} - {shift.end_time}</span>
                        </div>
                        
                        {/* Notes */}
                        {shift.notes && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {shift.notes}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyShiftCalendar;
