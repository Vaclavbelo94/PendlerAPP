import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyShiftCalendar from './WeeklyShiftCalendar';
import OptimizedShiftCalendar from '../OptimizedShiftCalendar';
import { ShiftCalendarProps } from '@/types/shifts';
import { useTranslation } from 'react-i18next';

const UnifiedShiftCalendar: React.FC<ShiftCalendarProps> = ({
  shifts,
  selectedDate,
  onSelectDate,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  isLoading,
  className
}) => {
  const { t } = useTranslation('shifts');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const handleAddShift = (date?: Date) => {
    if (date && onAddShiftForDate) {
      onAddShiftForDate(date);
    } else if (onAddShift) {
      onAddShift();
    }
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-4">
            {/* View Mode Selector */}
            <div className="mb-6">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'week' | 'month')}>
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="week" className="gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {t('weekView')}
                  </TabsTrigger>
                  <TabsTrigger value="month" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('monthView')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="week" className="mt-6">
                  <WeeklyShiftCalendar
                    shifts={shifts}
                    onEditShift={onEditShift || (() => {})}
                    onDeleteShift={onDeleteShift || (() => {})}
                    onAddShift={handleAddShift}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="month" className="mt-6">
                  <OptimizedShiftCalendar
                    shifts={shifts}
                    selectedDate={selectedDate}
                    onDateChange={onSelectDate}
                    onEditShift={onEditShift}
                    onDeleteShift={onDeleteShift}
                    onAddShift={onAddShift}
                    onAddShiftForDate={onAddShiftForDate}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UnifiedShiftCalendar;
