import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMobileShifts } from '@/hooks/shifts/useMobileShifts';
import MobileShiftsHeader from './MobileShiftsHeader';
import MobileCalendarView from './MobileCalendarView';
import MobileShiftCard from './MobileShiftCard';
import MobileShiftsStats from './MobileShiftsStats';
import MobileSectionNavigation, { MobileSectionType } from './MobileSectionNavigation';
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
  const [activeSection, setActiveSection] = useState<MobileSectionType>('calendar');
  
  const {
    currentDate,
    selectedDate,
    isReportSheetOpen,
    reportDate,
    shifts,
    allShifts,
    handleDateChange,
    handleDateSelect,
    handleOpenReport,
    handleCloseReport
  } = useMobileShifts();

  const handleDHLImportComplete = () => {
    setIsDHLImportOpen(false);
    onRefreshShifts?.();
  };

  const handleSectionChange = (section: MobileSectionType) => {
    setActiveSection(section);
    if (section === 'import') {
      setIsDHLImportOpen(true);
    }
  };

  // Use external shifts if provided (for compatibility)
  const shiftsToUse = externalShifts?.length > 0 ? externalShifts : allShifts;

  const getShiftForDate = (date: Date) => {
    return shiftsToUse.find(shift => {
      const shiftDate = new Date(shift.date + 'T00:00:00');
      return format(shiftDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'calendar':
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <MobileCalendarView
                currentDate={currentDate}
                selectedDate={selectedDate}
                shifts={shiftsToUse}
                onDateSelect={handleDateSelect}
              />
            </div>
            {selectedDate && (
              <div className="p-4 border-t border-border pb-20">
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

      case 'statistics':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <MobileShiftsStats
                shifts={shiftsToUse}
                currentDate={currentDate}
              />
            </div>
          </ScrollArea>
        );

      case 'import':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <p className="text-muted-foreground">
                {t('mobile.importDescription', 'Import funkcionalita se otevře v dialogu')}
              </p>
            </div>
          </div>
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
        <MobileSectionNavigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isDHLUser={user ? isDHLEmployeeSync(user) : false}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground text-sm">
              {t('loadingShifts', 'Načítání směn...')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative">
      <MobileShiftsHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />
      
      <MobileSectionNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isDHLUser={user ? isDHLEmployeeSync(user) : false}
      />
      
      {renderSectionContent()}

      {/* Floating Action Button pro přidání směny - only in calendar section */}
      {activeSection === 'calendar' && (
        <Button
          onClick={() => selectedDate ? onAddShiftForDate(selectedDate) : onAddShift()}
          size="icon"
          className="fixed bottom-6 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

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