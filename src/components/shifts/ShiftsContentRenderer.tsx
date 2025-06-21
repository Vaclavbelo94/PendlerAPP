
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import OptimizedShiftCalendar from './OptimizedShiftCalendar';
import OptimizedShiftsAnalytics from './OptimizedShiftsAnalytics';
import ShiftsReports from './ShiftsReports';
import ShiftsSettings from './ShiftsSettings';
import ShiftsExport from './ShiftsExport';
import BulkOperations from './BulkOperations';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);

  const handleShiftSelect = (shiftId: string) => {
    setSelectedShifts(prev => 
      prev.includes(shiftId) 
        ? prev.filter(id => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  const handleSelectAll = () => {
    const allShiftIds = shifts.map(shift => shift.id!).filter(Boolean);
    setSelectedShifts(allShiftIds);
  };

  const handleClearSelection = () => {
    setSelectedShifts([]);
  };

  const handleBulkDelete = async (shiftIds: string[]) => {
    for (const shiftId of shiftIds) {
      await onDeleteShift(shiftId);
    }
    setSelectedShifts([]);
  };

  const handleBulkEdit = (shiftIds: string[]) => {
    const firstShift = shifts.find(shift => shift.id === shiftIds[0]);
    if (firstShift) {
      onEditShift(firstShift);
    }
  };

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
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">{t('calendarView') || 'Kalendářní pohled'}</TabsTrigger>
            <TabsTrigger value="bulk">{t('bulkOperations') || 'Hromadné operace'}</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-6">
            <OptimizedShiftCalendar
              shifts={shifts}
              onEditShift={onEditShift}
              onDeleteShift={onDeleteShift}
            />
          </TabsContent>
          <TabsContent value="bulk" className="mt-6">
            <BulkOperations
              shifts={shifts}
              selectedShifts={selectedShifts}
              onShiftSelect={handleShiftSelect}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onBulkDelete={handleBulkDelete}
              onBulkEdit={handleBulkEdit}
            />
          </TabsContent>
        </Tabs>
      );
    case 'analytics':
      return <OptimizedShiftsAnalytics shifts={shifts} />;
    case 'reports':
      return <ShiftsReports shifts={shifts} />;
    case 'export':
      return <ShiftsExport shifts={shifts} />;
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
