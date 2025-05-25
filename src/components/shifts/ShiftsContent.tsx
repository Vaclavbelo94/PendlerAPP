
import React, { memo, useMemo } from 'react';
import { ShiftCalendarTab } from './ShiftCalendarTab';
import { ReportsTab } from './ReportsTab';
import ShiftAnalytics from './ShiftAnalytics';
import { Shift, ShiftType, AnalyticsPeriod } from './types';

interface ShiftsContentProps {
  activeSection: string;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: Shift[];
  currentShift: Shift | null;
  shiftType: ShiftType;
  setShiftType: (type: ShiftType) => void;
  shiftNotes: string;
  setShiftNotes: (notes: string) => void;
  user: any;
  onSaveShift: () => void;
  onDeleteShift: () => void;
  onOpenNoteDialog: () => void;
  analyticsPeriod: AnalyticsPeriod;
  setAnalyticsPeriod: (period: AnalyticsPeriod) => void;
}

export const ShiftsContent = memo<ShiftsContentProps>(({
  activeSection,
  selectedDate,
  onSelectDate,
  shifts,
  currentShift,
  shiftType,
  setShiftType,
  shiftNotes,
  setShiftNotes,
  user,
  onSaveShift,
  onDeleteShift,
  onOpenNoteDialog,
  analyticsPeriod,
  setAnalyticsPeriod
}) => {
  const memoizedShifts = useMemo(() => shifts, [shifts]);
  
  const renderActiveSection = useMemo(() => {
    switch (activeSection) {
      case "calendar":
        return (
          <ShiftCalendarTab 
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            shifts={memoizedShifts}
            currentShift={currentShift}
            shiftType={shiftType}
            setShiftType={setShiftType}
            shiftNotes={shiftNotes}
            setShiftNotes={setShiftNotes}
            user={user}
            onSaveShift={onSaveShift}
            onDeleteShift={onDeleteShift}
            onOpenNoteDialog={onOpenNoteDialog}
          />
        );
      case "analytics":
        return (
          <ShiftAnalytics 
            shifts={memoizedShifts}
            period={analyticsPeriod}
            onPeriodChange={setAnalyticsPeriod}
          />
        );
      case "reports":
        return (
          <ReportsTab shifts={memoizedShifts} user={user} />
        );
      default:
        return null;
    }
  }, [
    activeSection,
    selectedDate,
    onSelectDate,
    memoizedShifts,
    currentShift,
    shiftType,
    setShiftType,
    shiftNotes,
    setShiftNotes,
    user,
    onSaveShift,
    onDeleteShift,
    onOpenNoteDialog,
    analyticsPeriod,
    setAnalyticsPeriod
  ]);

  return (
    <div className="space-y-6">
      {renderActiveSection}
    </div>
  );
});

ShiftsContent.displayName = 'ShiftsContent';
