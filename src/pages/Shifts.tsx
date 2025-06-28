
import React from 'react';
import Layout from '@/components/layouts/Layout';
import UnifiedShiftsMainContainer from '@/components/shifts/UnifiedShiftsMainContainer';
import ShiftsPageHeader from '@/components/shifts/ShiftsPageHeader';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useTranslation } from 'react-i18next';
import { useUnifiedShiftsContainer } from '@/hooks/shifts/useUnifiedShiftsContainer';

const Shifts = () => {
  const { t } = useTranslation('shifts');
  const { handleOpenAddSheet } = useUnifiedShiftsContainer();

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <ShiftsPageHeader onAddShift={handleOpenAddSheet} />
          
          <div className="animate-fade-in">
            <UnifiedShiftsMainContainer />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shifts;
