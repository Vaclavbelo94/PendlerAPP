
import React from 'react';
import Layout from '@/components/layouts/Layout';
import UnifiedShiftsMainContainer from '@/components/shifts/UnifiedShiftsMainContainer';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useTranslation } from 'react-i18next';

const Shifts = () => {
  const { t } = useTranslation('shifts');

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              {t('shifts')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 animate-fade-in">
              {t('shiftsPageDescription', 'Manage your work shifts, track your schedule, and analyze your work patterns.')}
            </p>
          </div>
          
          <div className="animate-fade-in">
            <UnifiedShiftsMainContainer />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shifts;
