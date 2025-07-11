
import React from 'react';
import ShiftsNavigation from '@/components/shifts/ShiftsNavigation';
import ShiftsOverview from '@/components/shifts/ShiftsOverview';
import ShiftsCalendar from '@/components/shifts/ShiftsCalendar';
import ShiftsAnalytics from '@/components/shifts/ShiftsAnalytics';
import ShiftsReports from '@/components/shifts/ShiftsReports';
import ShiftsSettings from '@/components/shifts/ShiftsSettings';
import AnnualPlanImport from '@/components/admin/dhl/AnnualPlanImport';
import EmptyShiftsState from '@/components/shifts/EmptyShiftsState';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import { Shift } from '@/hooks/useShiftsManagement';
import { useTranslation } from 'react-i18next';

interface ShiftsPageContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift: () => void;
}

const ShiftsPageContent: React.FC<ShiftsPageContentProps> = ({
  activeSection,
  setActiveSection,
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift
}) => {
  const { t } = useTranslation('shifts');

  const renderSectionContent = () => {
    if (shifts.length === 0 && activeSection === 'calendar') {
      return <EmptyShiftsState onAddShift={onAddShift} />;
    }

    switch (activeSection) {
      case 'calendar':
        return (
          <ShiftsCalendar 
            shifts={shifts}
            onEditShift={onEditShift}
            onDeleteShift={onDeleteShift}
          />
        );
      case 'analytics':
        return <ShiftsAnalytics shifts={shifts} />;
      case 'reports':
        return <ShiftsReports shifts={shifts} />;
      case 'settings':
        return <ShiftsSettings />;
      case 'annual-import':
        return <AnnualPlanImport onImportComplete={() => setActiveSection('overview')} />;
      default:
        return (
          <ShiftsOverview 
            shifts={shifts}
            onEditShift={onEditShift}
            onDeleteShift={onDeleteShift}
          />
        );
    }
  };

  return (
    <ErrorBoundaryWithFallback>
      <div className="mb-6">
        <ShiftsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      <div className="pb-6">
        {renderSectionContent()}
      </div>
    </ErrorBoundaryWithFallback>
  );
};

export default ShiftsPageContent;
