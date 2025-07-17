import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Clock, MapPin, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Shift, ShiftType } from "../types";
import { cs, de, pl } from "date-fns/locale";
import { dateFromDBString } from "../utils/dateUtils";
import { useTranslation } from 'react-i18next';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { cn } from "@/lib/utils";

interface MobileShiftCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: Shift[];
  onUpdateShift?: (id: string, updatedData: any) => void;
  onDeleteShift?: (id: string) => void;
  onAddShiftForDate?: (date: Date) => void;
  isLoading?: boolean;
}

// Mobile-optimized shift calendar
export const MobileShiftCalendar: React.FC<MobileShiftCalendarProps> = ({
  selectedDate,
  onSelectDate,
  shifts,
  onUpdateShift,
  onDeleteShift,
  onAddShiftForDate,
  isLoading = false
}) => {
  const { t, i18n } = useTranslation('shifts');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

  // Get shifts for a specific date
  const getShiftsForDate = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateStr);
  }, [shifts]);

  // Get shift type color
  const getShiftTypeColor = (type: ShiftType) => {
    switch (type) {
      case 'morning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'afternoon': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'night': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  // Get calendar modifiers for desktop view
  const getCalendarModifiers = () => {
    if (!shifts.length) return {};
    
    const modifiers: { [key: string]: Date[] } = {};
    
    shifts.forEach(shift => {
      const date = dateFromDBString(shift.date);
      const key = `shift-${shift.type}`;
      if (!modifiers[key]) modifiers[key] = [];
      modifiers[key].push(date);
    });
    
    return modifiers;
  };

  // Get calendar styles
  const getCalendarStyles = () => ({
    '.rdp-day': {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
    },
    '.shift-morning': {
      backgroundColor: 'hsl(var(--amber-100))',
      color: 'hsl(var(--amber-800))',
    },
    '.shift-afternoon': {
      backgroundColor: 'hsl(var(--blue-100))',
      color: 'hsl(var(--blue-800))',
    },
    '.shift-night': {
      backgroundColor: 'hsl(var(--purple-100))',
      color: 'hsl(var(--purple-800))',
    },
  });

  // Mobile month view component
  const MobileMonthView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="space-y-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: getDateLocale() })}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Days */}
          {daysInMonth.map(date => {
            const dayShifts = getShiftsForDate(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-12 w-full flex flex-col items-center justify-center p-1 relative",
                  isToday && "ring-2 ring-primary",
                  isSelected && "bg-primary text-primary-foreground"
                )}
                onClick={() => onSelectDate(date)}
              >
                <span className="text-xs">{format(date, 'd')}</span>
                {dayShifts.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayShifts.slice(0, 3).map((shift, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-1 h-1 rounded-full",
                          shift.type === 'morning' && "bg-amber-500",
                          shift.type === 'afternoon' && "bg-blue-500",
                          shift.type === 'night' && "bg-purple-500"
                        )}
                      />
                    ))}
                    {dayShifts.length > 3 && (
                      <span className="text-[8px]">+{dayShifts.length - 3}</span>
                    )}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  // Mobile list view component
  const MobileListView = () => {
    const upcomingShifts = shifts
      .filter(shift => new Date(shift.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);

    if (upcomingShifts.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('noUpcomingShifts')}</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {upcomingShifts.map(shift => (
            <Card key={shift.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getShiftTypeColor(shift.type)} variant="outline">
                      {t(`shiftTypes.${shift.type}`)}
                    </Badge>
                    <span className="text-sm font-medium">
                      {format(new Date(shift.date), 'd. M. yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{shift.start_time} - {shift.end_time}</span>
                  </div>
                  
                  {shift.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {shift.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-1">
                  {onUpdateShift && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateShift(shift.id, shift)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  {onDeleteShift && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteShift(shift.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  // Desktop calendar view
  const DesktopCalendarView = () => (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        locale={getDateLocale()}
        className="rounded-md border w-full"
        modifiers={getCalendarModifiers()}
        modifiersStyles={getCalendarStyles()}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
      />
    </div>
  );

  // Selected date details
  const SelectedDateDetails = () => {
    if (!selectedDate) return null;
    
    const dayShifts = getShiftsForDate(selectedDate);
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>{format(selectedDate, 'd. MMMM yyyy', { locale: getDateLocale() })}</span>
            {onAddShiftForDate && (
              <Button
                size="sm"
                onClick={() => onAddShiftForDate(selectedDate)}
                className="h-8"
              >
                <Plus className="h-3 w-3 mr-1" />
                {t('addShift')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          {dayShifts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('noShiftsForDay')}
            </p>
          ) : (
            <div className="space-y-2">
              {dayShifts.map(shift => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getShiftTypeColor(shift.type)} variant="outline">
                        {t(`shiftTypes.${shift.type}`)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{shift.start_time} - {shift.end_time}</span>
                    </div>
                    
                    {shift.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {shift.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    {onUpdateShift && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateShift(shift.id, shift)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {onDeleteShift && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteShift(shift.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile view toggle */}
      <div className="flex md:hidden gap-2">
        <Button
          variant={viewMode === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('calendar')}
          className="flex-1"
        >
          Kalendář
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="flex-1"
        >
          Seznam
        </Button>
      </div>

      {/* Mobile views */}
      <div className="md:hidden">
        {viewMode === 'calendar' ? <MobileMonthView /> : <MobileListView />}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <DesktopCalendarView />
      </div>

      {/* Selected date details */}
      <SelectedDateDetails />
    </div>
  );
};