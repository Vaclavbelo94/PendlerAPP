import React, { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import MobileWeeklyOverview from './MobileWeeklyOverview';
import MobileShiftCard from './MobileShiftCard';
import MobileWeeklySummary from './MobileWeeklySummary';

interface MobileShiftsViewProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => Promise<void>;
  onAddShift: () => void;
  onAddShiftForDate: (date: Date) => void;
  isLoading: boolean;
}

const MobileShiftsView: React.FC<MobileShiftsViewProps> = ({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  isLoading
}) => {
  const { t } = useTranslation('shifts');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeTab, setActiveTab] = useState('shifts');

  // Calculate week boundaries
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter shifts for current week
  const weekShifts = useMemo(() => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= weekStart && shiftDate <= weekEnd;
    });
  }, [shifts, weekStart, weekEnd]);

  // Navigate weeks
  const goToPreviousWeek = () => setCurrentWeek(prev => subWeeks(prev, 1));
  const goToNextWeek = () => setCurrentWeek(prev => addWeeks(prev, 1));
  const goToCurrentWeek = () => setCurrentWeek(new Date());

  // Format week range
  const weekRange = `${format(weekStart, 'd.M.', { locale: cs })} – ${format(weekEnd, 'd.M.yyyy', { locale: cs })}`;
  const weekNumber = format(weekStart, 'I', { locale: cs });

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Sticky Header with Tabs */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/30 rounded-none">
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <Calendar className="h-4 w-4" />
              {t('calendar')}
            </TabsTrigger>
            <TabsTrigger 
              value="shifts" 
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <div className="h-4 w-4 bg-primary rounded-sm" />
              {t('shifts')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Weekly Navigation */}
      <div className="sticky top-12 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {t('weeklyView')} {weekNumber}
            </h2>
            <p className="text-sm text-muted-foreground">{weekRange}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousWeek}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToCurrentWeek}
              className="h-8 px-2 text-xs"
            >
              {t('today')}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextWeek}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week Days Overview */}
        <MobileWeeklyOverview 
          weekDays={weekDays}
          shifts={weekShifts}
          onDayClick={onAddShiftForDate}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="calendar" className="m-0 p-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t('calendarView')}</p>
                  <p className="text-sm">{t('clickDateToViewShifts')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shifts" className="m-0 p-4 space-y-4">
            {/* Shifts List */}
            <div className="space-y-3">
              {weekShifts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-muted-foreground">
                      <div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <p className="font-medium">{t('noShiftsForPeriod')}</p>
                      <p className="text-sm mt-1">{t('noShiftsMessage')}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                weekShifts.map((shift) => (
                  <MobileShiftCard
                    key={shift.id}
                    shift={shift}
                    onEdit={onEditShift}
                    onDelete={onDeleteShift}
                  />
                ))
              )}
            </div>

            {/* Weekly Summary */}
            <MobileWeeklySummary 
              shifts={weekShifts}
              weekNumber={weekNumber}
              weekRange={weekRange}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 z-10 bg-background border-t p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 flex items-center gap-2"
            onClick={onAddShift}
          >
            <Calendar className="h-4 w-4" />
            {t('calendarView')}
          </Button>
          <Button
            className="flex-1 flex items-center gap-2"
            onClick={() => onAddShiftForDate(new Date())}
          >
            <Plus className="h-4 w-4" />
            {t('addShift')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileShiftsView;