
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isSameDay } from 'date-fns';
import { CalendarDays, List, Plus } from 'lucide-react';
import { Shift } from '@/types/shifts';
import { useTranslation } from 'react-i18next';
import CustomCalendarGrid from './CustomCalendarGrid';
import ShiftDetailsCard from './ShiftDetailsCard';
import ShiftListView from './ShiftListView';

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
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

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

  const handleAddShift = useCallback((date?: Date) => {
    console.log('OptimizedShiftCalendar - handleAddShift called, date:', date);
    if (date && onAddShiftForDate) {
      onAddShiftForDate(date);
    } else if (onAddShift) {
      onAddShift(date);
    }
  }, [onAddShift, onAddShiftForDate]);

  const handleDateSelect = useCallback((date: Date) => {
    onDateChange(date);
  }, [onDateChange]);

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
            onClick={() => handleAddShift(selectedDate)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('addShift') || 'Přidat směnu'}</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* View mode tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'list')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              {t('calendarView') || 'Kalendář'}
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              {t('listView') || 'Seznam'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <CustomCalendarGrid
              selectedDate={selectedDate}
              currentMonth={currentMonth}
              onDateSelect={handleDateSelect}
              onMonthChange={setCurrentMonth}
              shifts={shifts}
              onAddShift={handleAddShift}
            />
            
            {selectedDate && (
              <ShiftDetailsCard
                selectedDate={selectedDate}
                shift={selectedDateShift}
                onAddShift={handleAddShift}
                onEditShift={onEditShift}
                onDeleteShift={onDeleteShift}
              />
            )}
          </TabsContent>

          <TabsContent value="list">
            <ShiftListView
              shifts={shifts}
              onEditShift={onEditShift}
              onDeleteShift={onDeleteShift}
              onAddShift={handleAddShift}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OptimizedShiftCalendar;
