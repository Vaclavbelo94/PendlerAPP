
import React, { useMemo, useCallback, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { cs } from "date-fns/locale";
import { Shift, ShiftType } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  currentShift?: Shift;
  onOpenNoteDialog?: () => void;
}

const SHIFT_TYPE_COLORS = {
  morning: 'bg-blue-100 text-blue-800 border-blue-200',
  afternoon: 'bg-orange-100 text-orange-800 border-orange-200',
  night: 'bg-purple-100 text-purple-800 border-purple-200'
} as const;

const SHIFT_TYPE_LABELS = {
  morning: 'Ranní',
  afternoon: 'Odpolední', 
  night: 'Noční'
} as const;

export const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onSelectDate,
  currentShift,
  onOpenNoteDialog
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Memoized shift lookup for better performance
  const shiftsByDate = useMemo(() => {
    const lookup = new Map<string, Shift>();
    
    shifts.forEach(shift => {
      const dateKey = format(shift.date, 'yyyy-MM-dd');
      lookup.set(dateKey, shift);
    });
    
    return lookup;
  }, [shifts]);

  // Memoized days in current month for virtualization
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Optimized shift lookup function
  const getShiftForDate = useCallback((date: Date): Shift | undefined => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return shiftsByDate.get(dateKey);
  }, [shiftsByDate]);

  // Custom day renderer without memoization to avoid type conflicts
  const DayContent = ({ date }: { date: Date }) => {
    const shift = getShiftForDate(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    
    return (
      <div 
        className={`
          relative w-full h-full min-h-[40px] p-1 rounded-md cursor-pointer transition-colors
          ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
        `}
        onClick={() => onSelectDate(date)}
        role="button"
        tabIndex={0}
        aria-label={`${format(date, 'dd.MM.yyyy', { locale: cs })}${shift ? `, ${SHIFT_TYPE_LABELS[shift.type as ShiftType]} směna` : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectDate(date);
          }
        }}
      >
        <div className="text-sm font-medium">
          {format(date, 'd')}
        </div>
        
        {shift && (
          <div className="mt-1">
            <Badge 
              variant="secondary" 
              className={`text-xs px-1 py-0 h-4 ${SHIFT_TYPE_COLORS[shift.type as ShiftType]}`}
            >
              {SHIFT_TYPE_LABELS[shift.type as ShiftType][0]}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    onSelectDate(today);
  }, [onSelectDate]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Kalendář směn
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Předchozí měsíc"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleTodayClick}
              className="px-3 py-1 text-sm hover:bg-muted rounded-md transition-colors"
            >
              Dnes
            </button>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Následující měsíc"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: cs })}
        </div>
      </CardHeader>
      
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={cs}
          className="w-full"
          components={{
            DayContent
          }}
        />
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="text-sm text-muted-foreground">Legenda:</div>
          {Object.entries(SHIFT_TYPE_LABELS).map(([type, label]) => (
            <Badge 
              key={type}
              variant="secondary" 
              className={`text-xs ${SHIFT_TYPE_COLORS[type as ShiftType]}`}
            >
              {label}
            </Badge>
          ))}
        </div>
        
        {/* Selected date info */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="font-medium">
              {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: cs })}
            </div>
            {currentShift ? (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={SHIFT_TYPE_COLORS[currentShift.type as ShiftType]}>
                    {SHIFT_TYPE_LABELS[currentShift.type as ShiftType]}
                  </Badge>
                  {currentShift.notes && (
                    <span className="text-sm text-muted-foreground">
                      Poznámka: {currentShift.notes.substring(0, 50)}
                      {currentShift.notes.length > 50 ? '...' : ''}
                    </span>
                  )}
                </div>
                {onOpenNoteDialog && (
                  <button
                    onClick={onOpenNoteDialog}
                    className="text-sm text-primary hover:underline"
                  >
                    Upravit poznámku
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">
                Žádná směna pro tento den
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedShiftCalendar;
