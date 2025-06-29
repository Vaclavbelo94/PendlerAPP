
import React from 'react';
import { RefreshCw } from 'lucide-react';
import OptimizedShiftCalendar from './OptimizedShiftCalendar';
import OptimizedShiftsAnalytics from './OptimizedShiftsAnalytics';
import EmptyShiftsState from './EmptyShiftsState';
import DHLTimeCalendarDemo from './calendar/DHLTimeCalendarDemo';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { useTranslation } from 'react-i18next';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { useAuth } from '@/hooks/auth';

interface ShiftsContentRendererProps {
  activeSection: string;
  isChanging: boolean;
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift?: () => void;
  onAddShiftForDate?: (date: Date) => void;
  calendarSelectedDate?: Date;
  handleCalendarDateChange?: (date: Date | undefined) => void;
}

const ShiftsContentRenderer: React.FC<ShiftsContentRendererProps> = ({
  activeSection,
  isChanging,
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  calendarSelectedDate,
  handleCalendarDateChange
}) => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  
  // Check if user is DHL employee
  const isDHLUser = user ? isDHLEmployee(user) : false;

  if (isChanging) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show empty state if no shifts exist
  if (shifts.length === 0 && onAddShift) {
    return <EmptyShiftsState onAddShift={onAddShift} />;
  }

  switch (activeSection) {
    case 'calendar':
      // Show DHL time calendar demo for DHL users
      if (isDHLUser) {
        return (
          <div className="space-y-6">
            <DHLTimeCalendarDemo />
            <div className="w-full">
              <OptimizedShiftCalendar
                shifts={shifts}
                onEditShift={onEditShift}
                onDeleteShift={onDeleteShift}
                onAddShift={onAddShift}
                onAddShiftForDate={onAddShiftForDate}
                selectedDate={calendarSelectedDate}
                onDateChange={handleCalendarDateChange}
              />
            </div>
          </div>
        );
      }
      
      return (
        <div className="w-full">
          <OptimizedShiftCalendar
            shifts={shifts}
            onEditShift={onEditShift}
            onDeleteShift={onDeleteShift}
            onAddShift={onAddShift}
            onAddShiftForDate={onAddShiftForDate}
            selectedDate={calendarSelectedDate}
            onDateChange={handleCalendarDateChange}
          />
        </div>
      );
    case 'analytics':
      return <OptimizedShiftsAnalytics shifts={shifts} />;
    default:
      // Show DHL time calendar demo for DHL users in default view too
      if (isDHLUser) {
        return (
          <div className="space-y-6">
            <DHLTimeCalendarDemo />
            <div className="w-full">
              <OptimizedShiftCalendar
                shifts={shifts}
                onEditShift={onEditShift}
                onDeleteShift={onDeleteShift}
                onAddShift={onAddShift}
                onAddShiftForDate={onAddShiftForDate}
                selectedDate={calendarSelectedDate}
                onDateChange={handleCalendarDateChange}
              />
            </div>
          </div>
        );
      }
      
      return (
        <div className="w-full">
          <OptimizedShiftCalendar
            shifts={shifts}
            onEditShift={onEditShift}
            onDeleteShift={onDeleteShift}
            onAddShift={onAddShift}
            onAddShiftForDate={onAddShiftForDate}
            selectedDate={calendarSelectedDate}
            onDateChange={handleCalendarDateChange}
          />
        </div>
      );
  }
};

export default ShiftsContentRenderer;
