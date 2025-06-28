
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">{t('shiftsDescription')}</p>
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
