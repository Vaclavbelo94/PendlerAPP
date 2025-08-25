import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileShifts, ViewType } from '@/hooks/shifts/useMobileShifts';
import MobileShiftsHeader from './MobileShiftsHeader';
import MobileCalendarView from './MobileCalendarView';
import MobileShiftCard from './MobileShiftCard';
import MobileShiftsStats from './MobileShiftsStats';
import MobileBottomNavigation from './MobileBottomNavigation';
import MobileShiftReportSheet from './MobileShiftReportSheet';
import { Shift } from '@/types/shifts';
import MobileDHLImportSheet from './MobileDHLImportSheet';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployeeSync } from '@/utils/dhlAuthUtils';

interface NewMobileShiftsViewProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => Promise<void>;
  onAddShift: () => void;
  onAddShiftForDate: (date: Date) => void;
  onRefreshShifts?: () => void;
  isLoading: boolean;
}

const NewMobileShiftsView: React.FC<NewMobileShiftsViewProps> = ({
  shifts: externalShifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  onRefreshShifts,
  isLoading
}) => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  const [isDHLImportOpen, setIsDHLImportOpen] = useState(false);
  
  const {
    currentDate,
    selectedDate,
    activeView,
    isReportSheetOpen,
    reportDate,
    shifts,
    allShifts,
    displayDays,
    handleDateChange,
    handleDateSelect,
    handleViewChange,
    handleOpenReport,
    handleCloseReport
  } = useMobileShifts();

  const handleDHLImportComplete = () => {
    setIsDHLImportOpen(false);
    onRefreshShifts?.();
  };

  // Use external shifts if provided (for compatibility)
  const shiftsToUse = externalShifts?.length > 0 ? externalShifts : allShifts;

  const getShiftForDate = (date: Date) => {
    return shiftsToUse.find(shift => {
      const shiftDate = new Date(shift.date + 'T00:00:00');
      return format(shiftDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'month':
        return (
          <div className="flex-1 flex flex-col">
            <MobileCalendarView
              currentDate={currentDate}
              selectedDate={selectedDate}
              shifts={shiftsToUse}
              onDateSelect={handleDateSelect}
            />
            {selectedDate && (
              <div className="p-4 border-t border-border">
                <MobileShiftCard
                  date={selectedDate}
                  shift={getShiftForDate(selectedDate)}
                  onEdit={onEditShift}
                  onDelete={onDeleteShift}
                  onReport={handleOpenReport}
                />
              </div>
            )}
          </div>
        );

      case 'threeDays':
      case 'oneDay':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {displayDays.map((day, index) => (
                <MobileShiftCard
                  key={index}
                  date={day}
                  shift={getShiftForDate(day)}
                  onEdit={onEditShift}
                  onDelete={onDeleteShift}
                  onReport={handleOpenReport}
                />
              ))}
              
              <MobileShiftsStats
                shifts={shiftsToUse}
                currentDate={currentDate}
              />
            </div>
          </ScrollArea>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <MobileShiftsHeader
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground text-sm">
              {t('loadingShifts', 'Načítání směn...')}
            </p>
          </div>
        </div>
        <MobileBottomNavigation
          activeView={activeView}
          onViewChange={handleViewChange}
        isDHLUser={user ? isDHLEmployeeSync(user) : false}
        onDHLImport={() => setIsDHLImportOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative">
      <MobileShiftsHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />
      
      {renderContent()}

      <MobileBottomNavigation
        activeView={activeView}
        onViewChange={handleViewChange}
        isDHLUser={user ? isDHLEmployeeSync(user) : false}
        onDHLImport={() => setIsDHLImportOpen(true)}
      />

      {/* Floating Action Button pro přidání směny */}
      <Button
        onClick={() => selectedDate ? onAddShiftForDate(selectedDate) : onAddShift()}
        size="icon"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <MobileShiftReportSheet
        isOpen={isReportSheetOpen}
        onOpenChange={handleCloseReport}
        date={reportDate}
        shift={reportDate ? getShiftForDate(reportDate) : undefined}
      />

      <MobileDHLImportSheet
        isOpen={isDHLImportOpen}
        onOpenChange={setIsDHLImportOpen}
        onImportComplete={handleDHLImportComplete}
      />
    </div>
  );
};

export default NewMobileShiftsView;