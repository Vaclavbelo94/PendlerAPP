
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Shift } from '@/types/shifts';

interface WeeklyShiftCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift: (date: Date) => void;
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
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get start of week (Monday)
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get shifts for selected date
  const selectedDateShifts = shifts.filter(shift => 
    isSameDay(parseISO(shift.date), selectedDate)
  );

  // Check if date has shifts
  const hasShifts = (date: Date) => 
    shifts.some(shift => isSameDay(parseISO(shift.date), date));

  const getShiftTypeIcon = (type: string) => {
    switch (type) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'night': return '🌙';
      default: return '👷‍♂️';
    }
  };

  const getShiftTypeName = (type: string) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      default: return t('customShift');
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

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-card rounded-lg p-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateWeek('prev')}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg">
            {format(weekStart, 'd. MMMM', { locale: cs })} - {format(addDays(weekStart, 6), 'd. MMMM yyyy', { locale: cs })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(currentWeek, 'YYYY', { locale: cs })} • Týden {format(currentWeek, 'w', { locale: cs })}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateWeek('next')}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayHasShifts = hasShifts(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                relative p-2 sm:p-3 rounded-lg text-center transition-all duration-200
                ${isSelected 
                  ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                  : 'bg-card hover:bg-muted/50'
                }
                ${isToday && !isSelected ? 'ring-2 ring-primary/20' : ''}
              `}
            >
              <div className="text-xs font-medium text-muted-foreground mb-1">
                {format(day, 'EEE', { locale: cs })}
              </div>
              <div className={`text-lg font-semibold ${isSelected ? 'text-primary-foreground' : ''}`}>
                {format(day, 'd')}
              </div>
              {dayHasShifts && (
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  isSelected ? 'bg-primary-foreground/80' : 'bg-primary'
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">
              {format(selectedDate, 'EEEE d. MMMM yyyy', { locale: cs })}
            </h4>
            <Button
              onClick={() => onAddShift(selectedDate)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('addShift')}
            </Button>
          </div>

          {/* Shifts for Selected Date */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : selectedDateShifts.length > 0 ? (
            <div className="space-y-3">
              {selectedDateShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="text-2xl">
                    {getShiftTypeIcon(shift.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className={getShiftTypeColor(shift.type)}>
                        {getShiftTypeName(shift.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{shift.start_time} – {shift.end_time}</span>
                    </div>
                    
                    {shift.notes && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {shift.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditShift(shift)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shift.id && onDeleteShift(shift.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-sm">{t('noShiftsForDay')}</p>
              <p className="text-xs mt-1">{t('addFirstShift')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyShiftCalendar;
