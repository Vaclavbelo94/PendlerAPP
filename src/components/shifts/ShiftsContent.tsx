
import React from 'react';
import { ShiftCalendarTab } from './ShiftCalendarTab';
import { ReportsTab } from './ReportsTab';
import ShiftAnalytics from './ShiftAnalytics';

interface ShiftsContentProps {
  activeSection: string;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: any[];
  currentShift: any;
  shiftType: any;
  setShiftType: (type: any) => void;
  shiftNotes: string;
  setShiftNotes: (notes: string) => void;
  user: any;
  onSaveShift: () => void;
  onDeleteShift: () => void;
  onOpenNoteDialog: () => void;
  analyticsPeriod: any;
  setAnalyticsPeriod: (period: any) => void;
}

export const ShiftsContent: React.FC<ShiftsContentProps> = ({
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
  return (
    <div className="space-y-6">
      {activeSection === "calendar" && (
        <ShiftCalendarTab 
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          shifts={shifts}
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
      )}

      {activeSection === "analytics" && (
        <ShiftAnalytics 
          shifts={shifts}
          period={analyticsPeriod}
          onPeriodChange={setAnalyticsPeriod}
        />
      )}

      {activeSection === "reports" && (
        <ReportsTab shifts={shifts} user={user} />
      )}
    </div>
  );
};
