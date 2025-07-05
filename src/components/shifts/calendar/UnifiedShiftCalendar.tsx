
import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedShiftCalendar from './OptimizedShiftCalendar';
import { ShiftCalendarProps } from '@/types/shifts';
import { useTranslation } from 'react-i18next';

const UnifiedShiftCalendar: React.FC<ShiftCalendarProps> = React.memo(({
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

  const handleAddShift = useCallback((date?: Date) => {
    if (date && onAddShiftForDate) {
      onAddShiftForDate(date);
    } else if (onAddShift) {
      onAddShift();
    }
  }, [onAddShift, onAddShiftForDate]);

  const memoizedMonthlyProps = useMemo(() => ({
    shifts,
    selectedDate,
    onDateChange: onSelectDate,
    onEditShift,
    onDeleteShift,
    onAddShift,
    onAddShiftForDate,
    isLoading
  }), [shifts, selectedDate, onSelectDate, onEditShift, onDeleteShift, onAddShift, onAddShiftForDate, isLoading]);

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-4">
            <OptimizedShiftCalendar {...memoizedMonthlyProps} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
});

UnifiedShiftCalendar.displayName = 'UnifiedShiftCalendar';

export default UnifiedShiftCalendar;
