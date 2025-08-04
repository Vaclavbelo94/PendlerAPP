import { useState, useCallback, useMemo } from 'react';
import { useShiftsCRUD } from './useShiftsCRUD';
import { format, startOfMonth, endOfMonth, isWithinInterval, addDays, subDays } from 'date-fns';

export type ViewType = 'month' | 'threeDays' | 'oneDay';

export const useMobileShifts = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeView, setActiveView] = useState<ViewType>('month');
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);
  const [reportDate, setReportDate] = useState<Date | undefined>(undefined);

  const {
    shifts,
    isLoading,
    isSaving,
    createShift,
    updateShift,
    deleteShift,
    refreshShifts
  } = useShiftsCRUD();

  // Filter shifts based on current view
  const visibleShifts = useMemo(() => {
    switch (activeView) {
      case 'month': {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return shifts.filter(shift => {
          const shiftDate = new Date(shift.date + 'T00:00:00');
          return isWithinInterval(shiftDate, { start: monthStart, end: monthEnd });
        });
      }
      case 'threeDays': {
        const startDate = subDays(selectedDate || currentDate, 1);
        const endDate = addDays(selectedDate || currentDate, 1);
        return shifts.filter(shift => {
          const shiftDate = new Date(shift.date + 'T00:00:00');
          return isWithinInterval(shiftDate, { start: startDate, end: endDate });
        });
      }
      case 'oneDay': {
        const targetDate = selectedDate || currentDate;
        return shifts.filter(shift => {
          const shiftDate = new Date(shift.date + 'T00:00:00');
          return format(shiftDate, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd');
        });
      }
      default:
        return shifts;
    }
  }, [shifts, activeView, currentDate, selectedDate]);

  // Get days to display based on view type
  const displayDays = useMemo(() => {
    switch (activeView) {
      case 'threeDays': {
        const baseDate = selectedDate || currentDate;
        return [
          subDays(baseDate, 1),
          baseDate,
          addDays(baseDate, 1)
        ];
      }
      case 'oneDay': {
        return [selectedDate || currentDate];
      }
      default:
        return [];
    }
  }, [activeView, selectedDate, currentDate]);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view);
  }, []);

  const handleOpenReport = useCallback((date: Date) => {
    setReportDate(date);
    setIsReportSheetOpen(true);
  }, []);

  const handleCloseReport = useCallback(() => {
    setIsReportSheetOpen(false);
    setReportDate(undefined);
  }, []);

  return {
    // State
    currentDate,
    selectedDate,
    activeView,
    isReportSheetOpen,
    reportDate,
    
    // Data
    shifts: visibleShifts,
    allShifts: shifts,
    displayDays,
    isLoading,
    isSaving,
    
    // Actions
    handleDateChange,
    handleDateSelect,
    handleViewChange,
    handleOpenReport,
    handleCloseReport,
    createShift,
    updateShift,
    deleteShift,
    refreshShifts
  };
};