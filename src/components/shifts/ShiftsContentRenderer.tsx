
import React from 'react';
import { RefreshCw } from 'lucide-react';
import OptimizedShiftCalendar from './OptimizedShiftCalendar';
import OptimizedShiftsAnalytics from './OptimizedShiftsAnalytics';
import ShiftsReports from './ShiftsReports';
import ShiftsSettings from './ShiftsSettings';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';

interface ShiftsContentRendererProps {
  activeSection: string;
  isChanging: boolean;
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

const ShiftsContentRenderer: React.FC<ShiftsContentRendererProps> = ({
  activeSection,
  isChanging,
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  if (isChanging) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  switch (activeSection) {
    case 'calendar':
      return (
        <OptimizedShiftCalendar
          shifts={shifts}
          onEditShift={onEditShift}
          onDeleteShift={onDeleteShift}
        />
      );
    case 'analytics':
      return <OptimizedShiftsAnalytics shifts={shifts} />;
    case 'reports':
      return <ShiftsReports shifts={shifts} />;
    case 'settings':
      return <ShiftsSettings />;
    default:
      return (
        <OptimizedShiftCalendar
          shifts={shifts}
          onEditShift={onEditShift}
          onDeleteShift={onDeleteShift}
        />
      );
  }
};

export default ShiftsContentRenderer;
